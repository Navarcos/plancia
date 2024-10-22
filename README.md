# Plancia

## Overview

Plancia is a management console for [Navarcos](https://github.com/Navarcos/navarcos).
This platform serves as an essential bridge for managing Skafos resources, providing users with complete control and a clear view of their operations.
Through Plancia, users can monitor the status of their Skafos instances, view metrics and activity logs, and manage resources intuitively.

## Install

Plancia is meant to be run in a Kubernetes cluster acting as a cluster manager for Navarcos.
The installation process is really simple:

1. Run a Navarcos instance (see [Navarcos](https://github.com/Navarcos/navarcos/))
2. Wait for Navarcos readiness
3. Ensure that your kubernetes environment (kubeconfig) refers to the previously created Navarcos cluster Manager.
4. Clone this project
5. Run [deploy.sh](https://github.com/Navarcos/plancia/blob/main/deploy.sh)
6. Accept Navarcos' CA, either:
   1. Copying the CA Certificate from the script output in a file and installing it in your browser
   2. Connecting and accepting the certificates to:
      * `https://keycloak.<IP ADDRESS OF NAVARCOS CONTROL PLANE>.nip.io`
      * `https://plancia-api.<IP ADDRESS OF NAVARCOS CONTROL PLANE>.nip.io`
      * `https://plancia.<IP ADDRESS OF NAVARCOS CONTROL PLANE>.nip.io`
   Correct URLs are printed during the deploy script.
7. Login with default credential:
   * username: `ncadmin@ncadmin.local`
   * password: `ncadmin`

## Create Skafos

A Skafos is a kubernetes cluster managed by navarcos.
In order to create a new Skafos select the "plus icon" (New Skafos) on the left sidebar.
Fill out the form and wait a few seconds to see the new skafos.
Click on the skafos to see additional info on its status and the resource inside it.

## Contributing

Instructions on how to contribute to the project.

* Fork the repository
* Create a new branch (`git checkout -b feature/amazing-feature`)
* Commit your changes (`git commit -m 'feat: add amazing-feature'`)
* Push to the branch (`git push origin feature/amazing-feature`)
* Open a Pull Request

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

* LICENSE
* <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Copyright

Copyright :copyright: 2024 [Activa Digital](https://www.activadigital.it).
