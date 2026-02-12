#!/usr/bin/env bash

# build release script for local testing
# helps test the release process before pushing tags

set -euo pipefail

# colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
    printf "${BLUE}info:${NC} %s\n" "$1"
}

success() {
    printf "${GREEN}success:${NC} %s\n" "$1"
}

error() {
    printf "${RED}error:${NC} %s\n" "$1"
}

# get version from cargo.toml
get_version() {
    grep '^version = ' Cargo.toml | head -1 | sed 's/version = "\(.*\)"/\1/'
}

# clean previous builds
clean_build() {
    info "cleaning previous builds..."
    cargo clean
    rm -rf dist/
    mkdir -p dist/
}

# build for current platform
build_current() {
    local version="$1"
    local target
    
    info "building for current platform..."
    cargo build --release
    
    # detect current target
    target=$(rustc -vV | grep host: | cut -d' ' -f2)
    
    # create archive
    info "creating archive for $target..."
    
    if [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
        # windows
        archive_name="portfolio-arcade-v${version}-${target}.zip"
        7z a "dist/${archive_name}" "./target/release/portfolio-arcade.exe"
        echo "windows archive created but checksum skipped"
    else
        # unix-like
        archive_name="portfolio-arcade-v${version}-${target}.tar.gz"
        tar -czvf "dist/${archive_name}" -C "./target/release" "portfolio-arcade"
        
        # create checksum
        cd dist/
        shasum -a 256 "$archive_name" > "${archive_name}.sha256"
        cd ../
    fi
    
    success "built: dist/${archive_name}"
}

# main function
main() {
    echo "portfolio-arcade release builder"
    echo "==============================="
    echo
    
    # check we're in the right directory
    if [[ ! -f "Cargo.toml" ]]; then
        error "run this script from the project root"
        exit 1
    fi
    
    # get version
    version=$(get_version)
    info "building version: v${version}"
    
    # clean and build
    clean_build
    build_current "$version"
    
    echo
    success "build complete! check the dist/ directory"
    echo
    echo "to test the archive:"
    echo "  1. extract it somewhere else"
    echo "  2. run the binary"
    echo "  3. verify it works correctly"
    echo
    echo "to create a release:"
    echo "  1. commit all changes"
    echo "  2. create and push a tag: git tag v${version} && git push origin v${version}"
    echo "  3. github actions will build and release automatically"
}

main "$@"