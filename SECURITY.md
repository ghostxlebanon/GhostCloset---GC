# Ghost Closet Security Policy

## Authorized maintenance

The repository is controlled by `ghostxlebanon`. Only the owner and explicitly authorized GitHub Apps used by the owner may write to the repository. No contributor, contractor, or third party is authorized unless the owner grants access directly in GitHub.

## Deployment security

The GitHub Pages workflow has read-only access to repository contents. It cannot commit or push changes to `main`, and it does not download storefront assets from third-party build hosts. Deployment uses the files already reviewed and committed in this repository.

## Customer-data boundary

Ghost Closet is a static storefront and does not collect card numbers, card expiry dates, CVC codes, passwords, or checkout addresses. Purchases are routed to linked official sellers, which are responsible for their own checkout security and policies.

## Reporting a vulnerability

Do not publish exploitable security details in a public issue. Contact the repository owner privately through their verified GitHub profile and include:

- the affected page or file;
- clear reproduction steps;
- the security impact;
- screenshots or a minimal proof of concept where appropriate.

Do not access other users’ data, attempt denial of service, deploy malware, or perform destructive testing.

## Intellectual property

Security research does not grant permission to copy, mirror, redistribute, commercialize, or create derivative versions of Ghost Closet. See `LICENSE` for the proprietary-use terms.
