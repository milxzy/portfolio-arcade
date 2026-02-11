#!/bin/bash

# portfolio arcade demo script
# demonstrates the cli tool functionality

echo "portfolio arcade demo"
echo "===================="
echo

echo "1. building the cli tool..."
cargo build --release --quiet

echo "2. showing help message..."
echo
./target/release/portfolio-arcade --help
echo

echo "3. available templates:"
echo "  - ps3: classic xmb interface"  
echo "  - ps5: modern gaming ui"
echo "  - wii: nintendo channel menu"
echo

echo "4. sample usage:"
echo "./target/release/portfolio-arcade init my-awesome-portfolio"
echo

echo "the interactive tui will guide you through:"
echo "  - theme selection (ps3/ps5/wii)"
echo "  - cms setup (decap/payload/none)"
echo "  - project configuration"
echo "  - automatic generation and dev server"
echo

echo "ready to create your gaming-themed portfolio!"
echo "run: ./target/release/portfolio-arcade init [project-name]"