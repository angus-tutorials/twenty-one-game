
resource "google_container_cluster" "k8s-sdx" {
  project = var.project_id
  name = "k8s-sdx"
  location = "europe-west2"
  initial_node_count = 1

  // Basic auth is disabled by setting user/pass to empty strings
  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }

}
