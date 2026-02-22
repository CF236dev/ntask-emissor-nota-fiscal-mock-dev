export interface Module {
  id: string;
  label: string;
  icon: string;
  color: string;
  internalPath?: string;
  externalUrl?: string;
}

export function getModules(config: {
  idpFrontendUrl?: string;
  processosUrl?: string;
}): Module[] {
  const idpFrontendUrl =
    config.idpFrontendUrl ||
    "https://ntask-idp-dev-frontend-la46tdhnda-uc.a.run.app";
  const processosUrl =
    config.processosUrl ||
    "https://ntask-processos-frontend-dev-la46tdhnda-uc.a.run.app";

  return [
    {
      id: "clientes",
      label: "Clientes",
      icon: "👤",
      color: "#5bc0de",
      externalUrl: `${idpFrontendUrl}/clientes`,
    },
    {
      id: "preposto",
      label: "Prepostos",
      icon: "👥",
      color: "#5cb85c",
      externalUrl: `${idpFrontendUrl}/preposto`,
    },
    {
      id: "processos",
      label: "Controle de Processos",
      icon: "📁",
      color: "#5bc0de",
      externalUrl: processosUrl,
    },
    {
      id: "emissor-nota-fiscal",
      label: "Emissor de Nota Fiscal",
      icon: "📄",
      color: "#5bc0de",
      internalPath: "/",
    },
  ];
}
