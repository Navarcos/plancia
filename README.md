# Plancia

## Overview
Plancia is a management console for [Navarcos](https://github.com/Navarcos/navarcos).
This platform serves as an essential bridge for managing Skafos resources, providing 
users with complete control and a clear view of their operations.
Through Plancia, users can monitor the status of their Skafos instances, 
view metrics and activity logs, and manage resources intuitively.

## Install
Plancia is meant to be run in a Kubernetes cluster acting as a cluster manager for Navarcos.
The installation process is really simple:
- Run a Navarcos instance (see [Navarcos](https://github.com/Navarcos/navarcos/blob/main/README.md))
- Wait for Navarcos readiness
- Ensure that your kubernetes environment (Kubeconfig) refers to the Navarcos cluster Manager created with Kind.
- Clone this project
- Run [deploy.sh](https://github.com/Navarcos/plancia/blob/main/deploy.sh)
- Copy the CA Certificate in a file and install it in your browser
- Open the printed url to open Plancia in a browser
- Login with default credential:
  - username: ncadmin@ncadmin.local
  - passowrd: ncadmin

  
## Contributing
Instructions on how to contribute to the project. Include a link to the contribution guidelines.

- Fork the repository
- Create a new branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'feat: add amazing-feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

## License
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

* LICENSE
* <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Copyright

Copyright :copyright: 2024 [Activa Digital](https://www.activadigital.it).