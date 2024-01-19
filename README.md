# free-game-notifier
A script to check Epic Games store weekly for new freebies, pushes notifications to discord.

## Configuration

| Config          | Description                                                                               | Default |
|-----------------|-------------------------------------------------------------------------------------------|---------|
| SEND_UPCOMING   | Configure whether or not to display upcoming freebies                                     | false   |
| DISCORD_WEBHOOK | Discord notification for free games (comma-separated string for multiple webhook support) |         |

## Usage

### Docker
```
docker run j6nca/free-game-notifier:latest npm run start \
-e SEND_UPCOMING=true \
-e DISCORD_WEBHOOK='foobar'
```

### Kubernetes
See [./examples/kubernetes/job.yml](https://github.com/j6nca/free-game-notifier/blob/main/examples/kubernetes/epic_games.yml)