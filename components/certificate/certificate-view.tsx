import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export interface CertificateData {
  recipient_name: string;
  trilha_title: string;
  level: string | null;
  hours: number | null;
  credential_code: string;
  issued_at: string;
}

// Certificado visual de conclusão de trilha (estilo PyTrack).
export function CertificateView({ data, verifyUrl }: { data: CertificateData; verifyUrl: string }) {
  const date = new Date(data.issued_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="relative mx-auto aspect-[1.41/1] w-full max-w-3xl overflow-hidden rounded-xl bg-[#0b1020] p-1.5 text-white shadow-2xl">
      {/* moldura dourada */}
      <div className="relative h-full w-full rounded-lg border-[3px] border-[#d4af37]/70 p-[6px]">
        <div className="flex h-full w-full flex-col rounded-md border border-[#3b4a7a] bg-[#0d1430] px-[5%] py-[4%]">
          {/* topo: código + QR */}
          <div className="flex items-start justify-between">
            <div className="rounded-md border border-[#d4af37]/50 px-2 py-1 text-[9px] font-semibold tracking-wider text-[#d4af37] sm:text-[11px]">
              {data.credential_code}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR de verificação" className="h-10 w-10 rounded bg-white p-0.5 sm:h-14 sm:w-14" />
              <span className="text-[6px] text-[#9fb0d8] sm:text-[8px]">VERIFIQUE A AUTENTICIDADE</span>
            </div>
          </div>

          {/* logo */}
          <div className="mt-1 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Image src="/new-logo.png" alt="PyTrack" width={28} height={28} className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-lg font-extrabold sm:text-2xl">PyTrack</span>
            </div>
            <span className="text-[7px] tracking-wide text-[#9fb0d8] sm:text-[10px]">Sua jornada Python. Seu futuro.</span>
          </div>

          {/* título */}
          <div className="mt-2 text-center">
            <h1 className="text-2xl font-black tracking-wide text-white sm:text-4xl">CERTIFICADO</h1>
            <div className="mx-auto mt-0.5 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#d4af37]/60" />
              <span className="text-[8px] font-semibold tracking-[0.2em] text-[#d4af37] sm:text-[11px]">DE CONCLUSÃO DE TRILHA</span>
              <span className="h-px w-8 bg-[#d4af37]/60" />
            </div>
          </div>

          {/* corpo */}
          <div className="mt-2 flex-1 text-center">
            <p className="text-[8px] text-[#9fb0d8] sm:text-[11px]">A PyTrack certifica que</p>
            <p className="mt-1 text-xl font-bold text-[#d4af37] sm:text-3xl" style={{ fontFamily: "Georgia, serif" }}>{data.recipient_name}</p>
            <p className="mx-auto mt-1.5 max-w-xl text-[8px] leading-relaxed text-[#c7d2f0] sm:text-[11px]">
              concluiu com êxito a trilha de aprendizado <strong className="text-white">{data.trilha_title}</strong> na PyTrack,
              demonstrando dedicação, disciplina e excelência no desenvolvimento de habilidades no ecossistema Python.
            </p>
          </div>

          {/* selo + métricas */}
          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] sm:h-14 sm:w-14">
                <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <span className="mt-0.5 text-[6px] font-bold tracking-wider text-[#d4af37] sm:text-[8px]">PYTRACK · TRILHAS</span>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1 px-2 sm:grid-cols-4">
              <Metric label="DATA DE CONCLUSÃO" value={date} />
              <Metric label="CARGA HORÁRIA" value={data.hours ? `${data.hours}h` : "—"} />
              <Metric label="NÍVEL" value={data.level ?? "—"} />
              <Metric label="VERIFICAÇÃO" value="100% ✓" />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm italic text-[#d4af37] sm:text-lg" style={{ fontFamily: "Georgia, serif" }}>Estevam Souza</span>
              <span className="mt-0.5 w-20 border-t border-[#9fb0d8]/40 pt-0.5 text-center text-[6px] text-[#9fb0d8] sm:w-28 sm:text-[8px]">ESTEVAM SOUZA<br />CEO & Fundador</span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-center gap-1 text-[6px] text-[#9fb0d8] sm:text-[9px]">
            <CheckCircle2 className="h-2.5 w-2.5 text-[#29E0A9]" /> Verifique em www.pytrack.com.br/certificado/{data.credential_code}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[6px] font-semibold tracking-wider text-[#9fb0d8] sm:text-[8px]">{label}</p>
      <p className="text-[8px] font-bold text-white sm:text-[11px]">{value}</p>
    </div>
  );
}
