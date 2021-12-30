# WakaSync

Sequel to [WakatimeExporter](https://github.com/Chicken/WakatimeExporter) which keeps data synced without dumping all data manually.  
Run on a cronjob daily to export yesterdays data to database.

## External Requirements

- MariaDB (with db from WakatimeExporter)
- Grafana

## Usage

1. Yoink your session id from wakatime cookies
2. Copy `.env.example` to `.env` and fill in the values
3. Run `npm install` or `yarn`
4. Make a cronjob such as `0 6 * * * /home/antti/WakaSync/run.sh`
