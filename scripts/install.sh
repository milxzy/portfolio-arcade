#!/usr/bin/env bash

# portfolio-arcade installer
# this script detects your platform and installs the latest release

set -euo pipefail

# colors for pretty output
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    MAGENTA='\033[0;35m'
    CYAN='\033[0;36m'
    NC='\033[0m' # no color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    MAGENTA=''
    CYAN=''
    NC=''
fi

# repo info
REPO="milxzy/portfolio-arcade"
BINARY_NAME="portfolio-arcade"

# installation paths
INSTALL_DIR="${HOME}/.local/bin"
PROFILE_SCRIPTS=("${HOME}/.bashrc" "${HOME}/.zshrc" "${HOME}/.bash_profile" "${HOME}/.profile")

# helper functions
info() {
    printf "${BLUE}info:${NC} %s\n" "$1" >&2
}

success() {
    printf "${GREEN}success:${NC} %s\n" "$1" >&2
}

warning() {
    printf "${YELLOW}warning:${NC} %s\n" "$1" >&2
}

error() {
    printf "${RED}error:${NC} %s\n" "$1" >&2
}

# detect operating system and architecture
detect_platform() {
    local os
    local arch
    local platform

    # get the os
    case "$(uname -s)" in
        Linux*)
            os="linux"
            ;;
        Darwin*)
            os="darwin"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            os="windows"
            ;;
        *)
            error "unsupported operating system: $(uname -s)"
            exit 1
            ;;
    esac

    # get the architecture
    case "$(uname -m)" in
        x86_64|amd64)
            arch="x86_64"
            ;;
        aarch64|arm64)
            arch="aarch64"
            ;;
        *)
            error "unsupported architecture: $(uname -m)"
            exit 1
            ;;
    esac

    # build the platform string
    if [[ "$os" == "linux" ]]; then
        platform="${arch}-unknown-linux-gnu"
    elif [[ "$os" == "darwin" ]]; then
        platform="${arch}-apple-darwin"
    elif [[ "$os" == "windows" ]]; then
        platform="${arch}-pc-windows-msvc"
    fi

    echo "$platform"
}

# get the latest release version from github
get_latest_version() {
    local api_url="https://api.github.com/repos/${REPO}/releases/latest"
    
    if command -v curl &> /dev/null; then
        curl -sSf "$api_url" | grep '"tag_name":' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/'
    elif command -v wget &> /dev/null; then
        wget -qO- "$api_url" | grep '"tag_name":' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/'
    else
        error "need curl or wget to download"
        exit 1
    fi
}

# download a file with progress
download_file() {
    local url="$1"
    local output="$2"
    
    info "downloading $(basename "$output")..."
    
    if command -v curl &> /dev/null; then
        curl -sSfL --progress-bar "$url" -o "$output"
    elif command -v wget &> /dev/null; then
        wget --progress=bar:force -q "$url" -O "$output"
    else
        error "need curl or wget to download"
        exit 1
    fi
}

# verify checksum
verify_checksum() {
    local file="$1"
    local checksum_file="$2"
    
    if [[ ! -f "$checksum_file" ]]; then
        warning "no checksum file found, skipping verification"
        return 0
    fi
    
    info "verifying checksum..."
    
    if command -v shasum &> /dev/null; then
        if shasum -a 256 -c "$checksum_file" &> /dev/null; then
            success "checksum verified"
        else
            error "checksum verification failed"
            exit 1
        fi
    else
        warning "shasum not available, skipping checksum verification"
    fi
}

# ensure install directory exists and is in PATH
setup_install_dir() {
    if [[ ! -d "$INSTALL_DIR" ]]; then
        info "creating install directory: $INSTALL_DIR"
        mkdir -p "$INSTALL_DIR"
    fi
    
    # check if it's in PATH
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        info "adding $INSTALL_DIR to PATH"
        
        # try to add to shell profile
        local profile_updated=false
        for profile in "${PROFILE_SCRIPTS[@]}"; do
            if [[ -f "$profile" ]]; then
                echo "" >> "$profile"
                echo "# added by portfolio-arcade installer" >> "$profile"
                echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> "$profile"
                success "updated $profile"
                profile_updated=true
                break
            fi
        done
        
        if [[ "$profile_updated" == false ]]; then
            # create .profile if nothing else exists
            echo "export PATH=\"\$PATH:$INSTALL_DIR\"" > "${HOME}/.profile"
            success "created ${HOME}/.profile"
        fi
        
        # update current session
        export PATH="$PATH:$INSTALL_DIR"
        
        warning "restart your shell or run 'source ~/.profile' to update PATH"
    fi
}

# main installation function
install_portfolio_arcade() {
    local platform version download_url archive_name checksum_url
    local temp_dir binary_path
    
    info "detecting platform..."
    platform=$(detect_platform)
    info "detected platform: $platform"
    
    info "checking for latest version..."
    version=$(get_latest_version)
    if [[ -z "$version" ]]; then
        error "couldn't get latest version"
        exit 1
    fi
    info "latest version: $version"
    
    # build download urls
    if [[ "$platform" == *"windows"* ]]; then
        archive_name="portfolio-arcade-${version}-${platform}.zip"
    else
        archive_name="portfolio-arcade-${version}-${platform}.tar.gz"
    fi
    
    download_url="https://github.com/${REPO}/releases/download/${version}/${archive_name}"
    checksum_url="${download_url}.sha256"
    
    # create temp directory for download
    temp_dir=$(mktemp -d)
    trap "rm -rf '$temp_dir'" EXIT
    
    # download archive and checksum
    download_file "$download_url" "${temp_dir}/${archive_name}"
    download_file "$checksum_url" "${temp_dir}/${archive_name}.sha256" || true
    
    # verify checksum
    verify_checksum "${temp_dir}/${archive_name}" "${temp_dir}/${archive_name}.sha256"
    
    # extract archive
    info "extracting archive..."
    if [[ "$platform" == *"windows"* ]]; then
        if command -v unzip &> /dev/null; then
            unzip -q "${temp_dir}/${archive_name}" -d "$temp_dir"
            binary_path="${temp_dir}/portfolio-arcade.exe"
        else
            error "unzip not found, can't extract windows archive"
            exit 1
        fi
    else
        tar -xzf "${temp_dir}/${archive_name}" -C "$temp_dir"
        binary_path="${temp_dir}/portfolio-arcade"
    fi
    
    # verify binary exists
    if [[ ! -f "$binary_path" ]]; then
        error "extracted binary not found: $binary_path"
        exit 1
    fi
    
    # setup install directory
    setup_install_dir
    
    # install the binary
    info "installing portfolio-arcade to $INSTALL_DIR..."
    
    if [[ "$platform" == *"windows"* ]]; then
        cp "$binary_path" "${INSTALL_DIR}/portfolio-arcade.exe"
        chmod +x "${INSTALL_DIR}/portfolio-arcade.exe"
    else
        cp "$binary_path" "${INSTALL_DIR}/portfolio-arcade"
        chmod +x "${INSTALL_DIR}/portfolio-arcade"
    fi
    
    success "portfolio-arcade installed successfully!"
    
    # test the installation
    if command -v portfolio-arcade &> /dev/null; then
        info "testing installation..."
        portfolio-arcade --version
        echo
        printf "${CYAN}ready to create some awesome portfolios!${NC}\n"
        printf "${CYAN}try: ${MAGENTA}portfolio-arcade init my-portfolio${NC}\n"
    else
        warning "portfolio-arcade not found in PATH"
        printf "try running: ${MAGENTA}source ~/.profile${NC}\n"
        printf "or restart your terminal and run: ${MAGENTA}portfolio-arcade --version${NC}\n"
    fi
}

# run the installer
main() {
    echo ""
    printf "${BOLD}${MAGENTA}    ╔══════════════════════════════════════════════════════╗${NC}\n"
    printf "${BOLD}${MAGENTA}    ║                                                      ║${NC}\n"
    printf "${BOLD}${MAGENTA}    ║               PORTFOLIO • ARCADE                     ║${NC}\n"
    printf "${BOLD}${MAGENTA}    ║                                                      ║${NC}\n"
    printf "${BOLD}${CYAN}    ║        gaming console-themed portfolios               ║${NC}\n"
    printf "${BOLD}${MAGENTA}    ║                                                      ║${NC}\n"
    printf "${BOLD}${MAGENTA}    ╚══════════════════════════════════════════════════════╝${NC}\n"
    echo ""
    
    printf "${CYAN}installing portfolio-arcade...${NC}\n"
    printf "${CYAN}create gaming console-themed portfolio websites${NC}\n\n"
    
    install_portfolio_arcade
}

# check if script is being sourced or executed
# when piped from curl, BASH_SOURCE may not be available, so we default to running main
if [[ "${BASH_SOURCE[0]:-$0}" == "${0}" ]]; then
    main "$@"
fi