/* ---------- data model: seed courses and eixo (axis) metadata ---------- */
const BASE_COURSES = [
  {id:"A1",eixo:"A",nome:"FluêncIA Educadores",inst:"ENAP/Escola Virtual.Gov",ch:3},
  {id:"A2",eixo:"A",nome:"Inteligência Artificial na Educação: Fundamentos",inst:"MEC/Avamec",ch:20},
  {id:"A3",eixo:"A",nome:"IA na prática docente",inst:"MEC/Avamec",ch:30},
  {id:"A4",eixo:"A",nome:"Metodologias, tecnologias digitais e IA",inst:"MEC/Avamec",ch:30},
  {id:"A5",eixo:"A",nome:"IA generativa na educação",inst:"MEC/Avamec",ch:40},
  {id:"A6",eixo:"A",nome:"Gerazine: IA generativa na curadoria e criação de recursos digitais",inst:"MEC/Avamec",ch:40},
  {id:"A7",eixo:"A",nome:"IA: uso criativo para transformar a aprendizagem",inst:"MEC/Avamec",ch:60},
  {id:"A8",eixo:"A",nome:"IA na prática docente: uso ético, criativo e pedagógico (ensino fundamental)",inst:"MEC/Avamec (Unesco)",ch:80},
  {id:"A9",eixo:"A",nome:"IA na prática docente: uso ético, criativo e pedagógico (ensino médio)",inst:"MEC/Avamec (Unesco)",ch:80},
  {id:"A10",eixo:"A",nome:"Formação para Professores em Inteligência Artificial",inst:"MEC/Avamec",ch:180},
  {id:"B1",eixo:"B",nome:"Criando Agentes com Copilot Studio para Microsoft 365",inst:"ENAP/Escola Virtual.Gov",ch:1},
  {id:"B2",eixo:"B",nome:"FluêncIA em Inteligência Artificial",inst:"Fundação Bradesco",ch:4},
  {id:"B3",eixo:"B",nome:"Soluções de IA no GitHub",inst:"Fundação Bradesco",ch:15},
  {id:"B4",eixo:"B",nome:"Trilhas Power Platform (Power Apps / Power Automate)",inst:"Microsoft Learn",ch:null},
  {id:"C1",eixo:"C",nome:"Desenho Universal para a Aprendizagem para Professores",inst:"IFB/Escola Virtual",ch:20},
  {id:"C2",eixo:"C",nome:"Desenho Universal para a Aprendizagem e Tecnologia Assistiva",inst:"Fundação Roberto Marinho/Futura",ch:null},
  {id:"C3",eixo:"C",nome:"Formação Continuada: Educação Especial Inclusiva",inst:"MEC/Avamec (UFG)",ch:80},
  {id:"G1",eixo:"G",nome:"Excel Avançado",inst:"ENAP/Escola Virtual.Gov",ch:30},
  {id:"G2",eixo:"G",nome:"Análise de dados como suporte à tomada de decisão",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"G3",eixo:"G",nome:"Análise de dados: uma leitura crítica das informações",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"D1",eixo:"D",nome:"Gestão de Projetos Educacionais",inst:"ENAP/Escola Virtual.Gov",ch:30},
  {id:"D2",eixo:"D",nome:"Introdução à Gestão de Projetos",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"D3",eixo:"D",nome:"Gestão de Projetos",inst:"ENAP/Escola Virtual.Gov",ch:10},
  {id:"I1",eixo:"I",nome:"Fundamentos e Metodologia da Educação Corporativa",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"I2",eixo:"I",nome:"Avaliação em Processos de Aprendizagem e Modelos de Feedback",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"I3",eixo:"I",nome:"Formação de Facilitadores de Aprendizagem",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"I4",eixo:"I",nome:"Desenho Instrucional para Soluções de Capacitações Presenciais",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"I5",eixo:"I",nome:"Noções Básicas para Coordenar Cursos On-line",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"F1",eixo:"F",nome:"Fundamentos da Lei Geral de Proteção de Dados (LGPD)",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"F2",eixo:"F",nome:"Introdução à Lei Brasileira de Proteção de Dados Pessoais",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"F3",eixo:"F",nome:"Proteção de Dados Pessoais no Setor Público",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"E1",eixo:"E",nome:"Introdução à Gestão de Processos",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"E2",eixo:"E",nome:"Análise e Melhoria de Processos",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"E3",eixo:"E",nome:"SEI! USAR",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"H1",eixo:"H",nome:"Políticas Públicas de Educação",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"H2",eixo:"H",nome:"Políticas Públicas e Governo Local",inst:"ENAP/Escola Virtual.Gov",ch:null},
  {id:"H3",eixo:"H",nome:"Análise Ex Ante de Políticas Públicas",inst:"ENAP/Escola Virtual.Gov",ch:null},
];
const EIXO_NAMES = {
  A:"Eixo A · IA na Educação (formação de formadores)",
  B:"Eixo B · Criação de sistemas com IA",
  C:"Eixo C · Educação Especial e Inclusiva (sala comum)",
  G:"Eixo G · Análise de dados e Excel avançado",
  D:"Eixo D · Gestão de projetos e planejamento",
  I:"Eixo I · Design instrucional e avaliação",
  F:"Eixo F · LGPD e proteção de dados",
  E:"Eixo E · Gestão documental e processos",
  H:"Eixo H · Legislação e políticas públicas",
  CUSTOM:"Cursos adicionados por você",
};
const EIXO_COLORS = {
  A:"#2F4C36", B:"#3E7C79", C:"#E68B35", G:"#6C8E4E", D:"#7B6CA6",
  I:"#B08968", F:"#4C7A9E", E:"#8A8A5C", H:"#A65B5B", CUSTOM:"#9FB0A4",
};
function eixoDot(k){ return `<span class="eixo-dot" style="background:${EIXO_COLORS[k]||'#999'}"></span>`; }
const ESTIMATED_CH = 8;
const START_DATE = new Date(2026,9,1);
const MONTH_NAMES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const STORAGE_KEY = "norte_rios_pdi_cronograma_v3";
