# free-game-notifier
A script to check Epic Games store weekly for new freebies, pushes notifications to discord.

## Configuration

| Config          | Description                                           | Default |
|-----------------|-------------------------------------------------------|---------|
| SEND_UPCOMING   | Configure whether or not to display upcoming freebies | false   |
| DISCORD_WEBHOOK | Discord notification for free games                   |         |

## Usage

### Docker
See [./examples/docker/docker-compose.yml]()

### Kubernetes
See [./examples/kubernetes/job.yml]()