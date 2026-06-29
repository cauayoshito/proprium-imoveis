// components/Disclaimer.tsx
//
// Aviso legal reutilizável. O Proprium INFORMA e ORGANIZA oportunidades de
// leilão; não presta consultoria/parecer jurídico e não garante a exatidão
// dos dados, que devem sempre ser conferidos no edital original da fonte.

type DisclaimerProps = {
  className?: string;
};

export default function Disclaimer({ className = "" }: DisclaimerProps) {
  return (
    <p
      className={`text-xs text-gray-500 leading-relaxed ${className}`}
      role="note"
    >
      O Proprium reúne e organiza informações públicas de leilão para facilitar a
      pesquisa. <strong>Não prestamos parecer jurídico</strong> nem garantimos a
      exatidão ou atualização dos dados. Sempre confira as condições, prazos e
      riscos no <strong>edital original</strong> da fonte antes de tomar qualquer
      decisão. Investir em leilão envolve riscos.
    </p>
  );
}
