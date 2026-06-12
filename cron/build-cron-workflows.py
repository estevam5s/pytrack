#!/usr/bin/env python3
"""Gera os nodes/connections JSON dos workflows N8N cron (weekly-report e startups)."""
import json
from pathlib import Path
base = Path(__file__).parent

# ═══ Weekly Report (sex 08:00 BRT = 11:00 UTC) ══════════════════════════════════
weekly_code_js = '''// Dispara o endpoint Next /api/cron/weekly-report
const url = ($env.VERCEL_APP_URL || 'https://scrum-master.vercel.app').replace(/\\/+$/, '') + '/api/cron/weekly-report';
const secret = $env.CRON_SECRET;
if (!secret) throw new Error('CRON_SECRET ausente no n8n env');

const res = await this.helpers.httpRequest({
  method: 'POST',
  url,
  headers: {
    'x-cron-secret': secret,
    'content-type': 'application/json',
  },
  body: {},
  json: true,
  returnFullResponse: true,
  timeout: 60000,
});

return [{ json: {
  ok: res.statusCode >= 200 && res.statusCode < 300,
  status: res.statusCode,
  body: res.body,
  firedAt: new Date().toISOString(),
} }];
'''

weekly_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    { "field": "cronExpression", "expression": "0 0 11 * * 5" }
                ]
            }
        },
        "id": "weekly-trigger",
        "name": "Toda sexta 08:00 BRT",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [0, 0],
    },
    {
        "parameters": {"jsCode": weekly_code_js},
        "id": "weekly-fire",
        "name": "POST /api/cron/weekly-report",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [320, 0],
    },
]
weekly_connections = {
    "Toda sexta 08:00 BRT": {
        "main": [[{"node": "POST /api/cron/weekly-report", "type": "main", "index": 0}]]
    }
}

# ═══ Startups + Tech (tick HORÁRIO — backend decide se roda baseado em team_startups_config) ═
# IMPORTANTE: não use cron fixo semanal aqui — o endpoint /api/cron/startups já tem
# shouldRunByConfig() que respeita schedule_dow/schedule_hour/timezone por time.
# Um tick horário cobre QUALQUER horário que o admin configurar na UI.
startups_code_js = '''// Dispara o endpoint Next /api/cron/startups
const url = ($env.VERCEL_APP_URL || 'https://scrum-master.vercel.app').replace(/\\/+$/, '') + '/api/cron/startups';
const secret = $env.CRON_SECRET;
if (!secret) throw new Error('CRON_SECRET ausente no n8n env');

const res = await this.helpers.httpRequest({
  method: 'POST',
  url,
  headers: {
    'x-cron-secret': secret,
    'content-type': 'application/json',
  },
  body: {},
  json: true,
  returnFullResponse: true,
  timeout: 60000,
});

return [{ json: {
  ok: res.statusCode >= 200 && res.statusCode < 300,
  status: res.statusCode,
  body: res.body,
  firedAt: new Date().toISOString(),
} }];
'''

startups_nodes = [
    {
        "parameters": {
            "rule": {
                "interval": [
                    { "field": "cronExpression", "expression": "0 0 * * * *" }
                ]
            }
        },
        "id": "startups-trigger",
        "name": "Tick horario (backend decide)",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [0, 0],
    },
    {
        "parameters": {"jsCode": startups_code_js},
        "id": "startups-fire",
        "name": "POST /api/cron/startups",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [320, 0],
    },
]
startups_connections = {
    "Tick horario (backend decide)": {
        "main": [[{"node": "POST /api/cron/startups", "type": "main", "index": 0}]]
    }
}

(base / '_weekly.nodes.json').write_text(json.dumps(weekly_nodes, ensure_ascii=False))
(base / '_weekly.connections.json').write_text(json.dumps(weekly_connections, ensure_ascii=False))
(base / '_startups.nodes.json').write_text(json.dumps(startups_nodes, ensure_ascii=False))
(base / '_startups.connections.json').write_text(json.dumps(startups_connections, ensure_ascii=False))

print('weekly nodes:', len(weekly_nodes), '| startups nodes:', len(startups_nodes))
print('files written in doc/')
