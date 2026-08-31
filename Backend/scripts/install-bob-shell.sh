#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
install_prefix="${project_root}/.bob-shell"
version_url="https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt"

mkdir -p "${install_prefix}"
export PATH="${install_prefix}/bin:${PATH}"

if [[ -n "${BOB_SHELL_VERSION:-}" ]]; then
    version="${BOB_SHELL_VERSION}"
else
    version="$(curl -fsSL "${version_url}")"
fi

if [[ ! "${version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z]+\.[0-9]+)?$ ]]; then
    echo "Invalid Bob Shell version received from IBM."
    exit 1
fi

archive_url="https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-${version}.tgz"
checksum_url="${archive_url}.sha256"
archive_path="$(mktemp).tgz"
trap 'rm -f "${archive_path}"' EXIT

expected_sha256="$(curl -fsSL "${checksum_url}")"
curl -fsSL "${archive_url}" -o "${archive_path}"

if command -v sha256sum >/dev/null 2>&1; then
    actual_sha256="$(sha256sum "${archive_path}" | cut -d ' ' -f1)"
else
    actual_sha256="$(shasum -a 256 "${archive_path}" | cut -d ' ' -f1)"
fi

if [[ "${actual_sha256}" != "${expected_sha256}" ]]; then
    echo "Bob Shell package integrity verification failed."
    exit 1
fi

npm --prefix "${install_prefix}" install --global \
    --registry=https://registry.npmjs.org/ \
    --progress=false \
    --loglevel=error \
    "${archive_path}"

if [[ ! -x "${install_prefix}/bin/bob" ]]; then
    echo "Bob Shell executable was not installed in ${install_prefix}/bin."
    exit 1
fi

node "${project_root}/scripts/verify-bob-shell.js" "${install_prefix}/bin/bob"
