data "google_client_config" "default" {}

provider "kubernetes" {
  host                    = "https://${google_container_cluster.k8s-sdx.endpoint}"
  token                   = data.google_client_config.default.access_token
  cluster_ca_certificate  = base64decode(
    google_container_cluster.k8s-sdx.master_auth[0].cluster_ca_certificate,
  )
}

# Creates a config map to load in player details from players.json
resource "kubernetes_config_map" "player-config" {
  metadata {
    name = "player-config-json"
    namespace = "default"
  }
# Is this the best way to do this? Should we be loading this as an env var instead?
  data = {
    "players.json" = file("${path.module}/players.json")
  }
}
# Create main game pod and mount the configMap to it. This will allow 'real time' updates to the player info by editing
# the configMap during runtime
resource "kubernetes_pod" "twenty-one-game" {
  metadata {
    name = "twenty-one-game"
    labels = {
      app: "twenty-one-game"
    }
  }

  spec {
    container {
      image = "eu.gcr.io/ons-sdx-training/twenty-one-game:latest"
      name = "twenty-one-game"
      image_pull_policy = "Always"

      env {
        name = "PYTHONUNBUFFERED"
        value = "1"
      }

      volume_mount {
        mount_path = "/config"
        name = "config"
      }
    }

    volume {
      name = "config"
      config_map {
        name = "player-config-json"
      }
    }
  }
}
