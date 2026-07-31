import { useEffect, useRef, useState } from "react";

const GITHUB = "https://github.com/IgorSebastiann";
const LINKEDIN = "https://www.linkedin.com/in/igor-sebastian-mathias-948697250/";
const TELEFONE = "https://api.whatsapp.com/send?phone=5547997834557&text=Ol%C3%A1%2C%20Igor!%20Gostaria%20de%20conversar%20sobre%20um%20projeto.";

const projects = [
  {
    code: "01 / WEB",
    name: "Newsletter — Engenharia de Software",
    description: "Aplicação acadêmica de newsletter criada para o curso de Engenharia de Software da Católica SC.",
    tech: ["JavaScript", "Web"],
    link: `${GITHUB}/Newsletter-Engenharia-de-Software_CatolicaSC`,
    accent: "lime",
  },
  {
    code: "02 / RPA",
    name: "UiPath Skills",
    description: "Repositório de prática e documentação de atividades, pacotes e fundamentos de desenvolvimento RPA.",
    tech: ["Python", "UiPath", "Automação"],
    link: `${GITHUB}/Uipath-Skills`,
    accent: "cyan",
  },
  {
    code: "03 / API",
    name: "API Seminário Web",
    description: "API REST acadêmica que demonstra fundamentos de backend e design de interfaces de programação.",
    tech: ["Java", "REST API"],
    link: `${GITHUB}/Api-Seminario-Web`,
    accent: "orange",
  },
  {
    code: "04 / QA",
    name: "N3 — Qualidade de Software",
    description: "Projeto acadêmico centrado em testes e práticas de garantia de qualidade de software.",
    tech: ["JavaScript", "QA"],
    link: `${GITHUB}/N3-Qualidade-de-Software`,
    accent: "violet",
  },
] as const;

const skillGroups = [
  {
    index: "01",
    title: "Automação & RPA",
    description: "Fluxos confiáveis para reduzir trabalho repetitivo e integrar operações.",
    skills: ["Python Automation", "UiPath Studio", "REFramework", "Orchestrator", "PDF & Excel", "Web scraping", "APIs"],
  },
  {
    index: "02",
    title: "Software & Web",
    description: "Sistemas web funcionais, da interface à persistência e publicação.",
    skills: ["JavaScript", "React", "Node.js", "Supabase", "Neon", "Tailwind CSS", "Vercel"],
  },
  {
    index: "03",
    title: "IA aplicada",
    description: "Skills e prompts que tornam automações e fluxos de desenvolvimento mais inteligentes.",
    skills: ["Custom AI Skills", "Prompt engineering", "AI-assisted development"],
  },
  {
    index: "04",
    title: "Fundamentos",
    description: "Base acadêmica e prática para evoluir soluções com consistência.",
    skills: ["Java", "C#", "Git", "GitHub", "HTML semântico", "CSS responsivo"],
  },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function Phone({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "📲↗" : "📲"}</span>;
}

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scroll = scrollY;
    const points = Array.from({ length: 78 }, (_, i) => ({
      x: Math.sin(i * 91.73) * 1.8,
      y: Math.cos(i * 53.21) * 1.25,
      z: (i % 13) / 13 * 5 - 2.5,
    }));

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (event: PointerEvent) => {
      mouseX = event.clientX / width - 0.5;
      mouseY = event.clientY / height - 0.5;
    };
    const updateScroll = () => { scroll = scrollY; };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const progress = scroll / Math.max(document.body.scrollHeight - height, 1);
      const phase = progress * Math.PI * 3;
      const centerX = width * (0.72 - progress * 0.18) + mouseX * 22;
      const centerY = height * (0.48 + Math.sin(phase) * 0.08) + mouseY * 18;
      const scale = Math.min(width, height) * (width < 700 ? 0.28 : 0.38);
      const rotation = reduced ? phase * 0.15 : phase * 0.38 + time * 0.00004;
      const projected: { x: number; y: number; depth: number }[] = [];

      for (const point of points) {
        const wave = Math.sin(point.z * 1.8 + phase) * (0.22 + progress * 0.18);
        const px = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
        const pz = point.x * Math.sin(rotation) + point.z * Math.cos(rotation) + 5.5;
        const perspective = 2.8 / pz;
        projected.push({
          x: centerX + px * perspective * scale,
          y: centerY + (point.y + wave) * perspective * scale,
          depth: perspective,
        });
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 82) {
            ctx.strokeStyle = `rgba(184,255,79,${(1 - distance / 82) * 0.17})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const point of projected) {
        ctx.fillStyle = `rgba(184,255,79,${Math.min(point.depth * 0.55, 0.75)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0.8, point.depth * 2), 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", pointer, { passive: true });
    addEventListener("scroll", updateScroll, { passive: true });
    draw(0);
    if (!reduced) raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", pointer);
      removeEventListener("scroll", updateScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="scene" aria-hidden="true" />;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = () => setMenuOpen(false);
    addEventListener("hashchange", close);
    return () => removeEventListener("hashchange", close);
  }, []);

  return (
    <>
      <Scene />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Igor Sebastian — início">
          <span>IS</span><i />
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="nav">
          {menuOpen ? "Fechar" : "Menu"}
        </button>
        <nav id="nav" className={menuOpen ? "open" : ""} aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#projetos">Projetos</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="status" href="#contato"><i /> Disponível para conversar</a>
      </header>

      <main id="conteudo">
        <section className="hero" id="top">
          <div className="eyebrow"><span>RPA / SOFTWARE / AI</span><span>Jaraguá do Sul, BR</span></div>
          <div className="hero-copy">
            <p className="kicker">Olá, eu sou Igor Sebastian.</p>
            <h1>Eu transformo<br />rotina em <em>fluxo.</em></h1>
            <p className="hero-lead">Desenvolvedor RPA e estudante de Engenharia de Software criando automações confiáveis, sistemas web e soluções inteligentes.</p>
            <div className="hero-actions">
              <a className="button primary" href="#projetos">Explorar projetos <Arrow /></a>
              <a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true"><b>01</b><span>/ 05</span></div>
          <div className="scroll-cue"><span>Role para explorar</span><i /></div>
        </section>

        <section className="section about" id="sobre">
          <div className="section-label"><span>01</span> Sobre</div>
          <div className="section-body">
            <p className="statement">Automação é mais do que velocidade.<br /><strong>É liberar pessoas para o trabalho que realmente importa.</strong></p>
            <div className="about-grid">
              <p>Sou desenvolvedor RPA júnior com 1 ano de experiência profissional em automação: comecei com UiPath e hoje concentro meu trabalho em Python.</p>
              <p>No 6º semestre de Engenharia de Software na Católica SC, amplio essa base com desenvolvimento web, APIs, dados e IA aplicada.</p>
            </div>
            <div className="facts" aria-label="Resumo profissional">
              <div><b>01</b><span>ano em automação profissional</span></div>
              <div><b>08</b><span>meses de prática com UiPath</span></div>
              <div><b>06º</b><span>semestre de Engenharia de Software</span></div>
            </div>
          </div>
        </section>

        <section className="section skills" id="habilidades">
          <div className="section-label"><span>02</span> Habilidades</div>
          <div className="section-body">
            <div className="section-intro">
              <h2>Do processo<br />ao <em>produto.</em></h2>
              <p>Um repertório construído na interseção entre automação, software e melhoria contínua.</p>
            </div>
            <div className="skill-list">
              {skillGroups.map((group) => (
                <article key={group.index}>
                  <span>{group.index}</span>
                  <div><h3>{group.title}</h3><p>{group.description}</p></div>
                  <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section projects" id="projetos">
          <div className="section-label"><span>03</span> Projetos</div>
          <div className="section-body">
            <div className="section-intro">
              <h2>Trabalho em<br /><em>evidência.</em></h2>
              <p>Projetos públicos que registram minha evolução entre web, automação, APIs e qualidade.</p>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <a className={`project ${project.accent}`} key={project.name} href={project.link} target="_blank" rel="noreferrer">
                  <div className="project-visual" aria-hidden="true"><span>{project.code}</span><i /><b>{project.name.slice(0, 2).toUpperCase()}</b></div>
                  <div className="project-copy">
                    <small>{project.code}</small>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ul>{project.tech.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <span className="project-arrow"><Arrow diagonal /></span>
                </a>
              ))}
            </div>
            <a className="button outline" href={`${GITHUB}?tab=repositories`} target="_blank" rel="noreferrer">Ver todos no GitHub <Arrow diagonal /></a>
          </div>
        </section>

        <section className="section journey" id="jornada">
          <div className="section-label"><span>04</span> Jornada</div>
          <div className="section-body">
            <div className="section-intro">
              <h2>Aprender.<br />Aplicar. <em>Evoluir.</em></h2>
            </div>
            <ol className="timeline">
              <li><span>Base</span><h3>Engenharia de Software</h3><p>Fundamentos de desenvolvimento, qualidade e construção de sistemas na Católica SC.</p></li>
              <li><span>Imersão</span><h3>RPA com UiPath</h3><p>Oito meses criando e entendendo fluxos com Studio, REFramework e Orchestrator.</p></li>
              <li><span>Agora</span><h3>Automação com Python</h3><p>Migração do trabalho de automação para scripts, APIs, documentos, planilhas e web.</p></li>
              <li><span>Próximo</span><h3>Software + IA aplicada</h3><p>Evolução contínua em sistemas web e skills de IA para processos mais inteligentes.</p></li>
            </ol>
          </div>
        </section>

        <section className="contact" id="contato">
          <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
          <p>Tem um processo para automatizar ou uma ideia para construir?</p>
          <h2>Vamos tirar<br />do <em>manual.</em></h2>
          <div className="contact-actions">
            <a className="button primary" href={LINKEDIN} target="_blank" rel="noreferrer">Conversar no LinkedIn <Arrow diagonal /></a>
            <a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">Ver GitHub <Arrow diagonal /></a>
            <a className="text-link" href={TELEFONE} target="_blank" rel="noreferrer">Telefone <Phone diagonal /></a>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#top"><span>IS</span><i /></a>
        <p>Igor Sebastian Mathias<br /><span>RPA & Software Developer</span></p>
        <div><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href={TELEFONE} target="_blank" rel="noreferrer">Telefone</a></div>
        <small>© {new Date().getFullYear()} — Feito com intenção.</small>,
      </footer>
    </>
  );
}
