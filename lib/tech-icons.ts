// Mapeia tecnologias para ícones reais (logos coloridos).
// Devicon (jsDelivr) para os logos autênticos; Simple Icons como fallback.

const DEVICON = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const SIMPLE = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

// chave = nome (normalizado lower) do stack_item
export const TECH_ICONS: Record<string, string> = {
  python: DEVICON("python"),
  fastapi: DEVICON("fastapi"),
  django: DEVICON("django", "plain"),
  flask: DEVICON("flask"),
  pandas: DEVICON("pandas"),
  numpy: DEVICON("numpy"),
  matplotlib: DEVICON("matplotlib"),
  seaborn: SIMPLE("seaborn", "7DB0BC"),
  jupyter: DEVICON("jupyter"),
  sqlalchemy: DEVICON("sqlalchemy"),
  postgresql: DEVICON("postgresql"),
  supabase: DEVICON("supabase"),
  docker: DEVICON("docker"),
  "docker compose": DEVICON("docker"),
  git: DEVICON("git"),
  github: DEVICON("github", "original"),
  "github actions": SIMPLE("githubactions", "2088FF"),
  mqtt: SIMPLE("mqtt", "660066"),
  "paho-mqtt": SIMPLE("mqtt", "660066"),
  "raspberry pi": DEVICON("raspberrypi"),
  airflow: DEVICON("apacheairflow"),
  spark: DEVICON("apachespark"),
  pyspark: DEVICON("apachespark"),
  pytest: DEVICON("pytest"),
  pydantic: SIMPLE("pydantic", "E92063"),
  ruff: SIMPLE("ruff", "D7FF64"),
  mypy: SIMPLE("python", "2A6DB2"),
  black: SIMPLE("python", "000000"),
  typer: SIMPLE("typer", "0096FF"),
  rich: SIMPLE("python", "FFD43B"),
  graphql: SIMPLE("graphql", "E10098"),
  grpc: SIMPLE("trpc", "2596BE"),
  websockets: SIMPLE("socketdotio", "010101"),
  httpx: SIMPLE("python", "0A7BBB"),
  sqlmodel: SIMPLE("sqlalchemy", "D71F00"),
  alembic: SIMPLE("sqlalchemy", "6BA81E"),
  redis: DEVICON("redis"),
  asyncio: DEVICON("python"),
  celery: SIMPLE("celery", "37814A"),
  rabbitmq: DEVICON("rabbitmq"),
  kafka: DEVICON("apachekafka"),
  polars: SIMPLE("polars", "CD792C"),
  duckdb: SIMPLE("duckdb", "FFF000"),
  scipy: SIMPLE("scipy", "8CAAE6"),
  plotly: DEVICON("plotly"),
  streamlit: DEVICON("streamlit"),
  "scikit-learn": DEVICON("scikitlearn"),
  pytorch: DEVICON("pytorch"),
  "hugging face": SIMPLE("huggingface", "FFD21E"),
  opencv: DEVICON("opencv"),
  scrapy: SIMPLE("scrapy", "60A839"),
  playwright: DEVICON("playwright"),
  beautifulsoup: SIMPLE("python", "4B8BBE"),
  kubernetes: DEVICON("kubernetes"),
  terraform: DEVICON("terraform"),
  nginx: DEVICON("nginx"),
  gunicorn: SIMPLE("gunicorn", "499848"),
  uvicorn: SIMPLE("gunicorn", "499848"),
  prometheus: DEVICON("prometheus"),
  grafana: DEVICON("grafana"),
  opentelemetry: DEVICON("opentelemetry"),
  sentry: DEVICON("sentry"),
  "tensorflow/keras": DEVICON("tensorflow"),
  tensorflow: DEVICON("tensorflow"),
};

export function techIconUrl(name?: string | null): string | null {
  if (!name) return null;
  return TECH_ICONS[name.trim().toLowerCase()] ?? null;
}
