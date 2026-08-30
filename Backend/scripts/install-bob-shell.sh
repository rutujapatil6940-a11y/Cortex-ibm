#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
install_prefix="${BOB_SHELL_INSTALL_DIR:-"${project_root}/.bob-shell"}"

mkdir -p "${install_prefix}"
export NPM_CONFIG_PREFIX="${install_prefix}"
export PATH="${install_prefix}/bin:${PATH}"

installer_args=(--pm npm)
if [[ -n "${BOB_SHELL_VERSION:-}" ]]; then
    installer_args+=(--version "${BOB_SHELL_VERSION}")
fi

curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash -s -- "${installer_args[@]}"
"${install_prefix}/bin/bob" --version
