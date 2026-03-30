type RouteShellProps = {
  title: string;
  route: string;
  description: string;
  bullets: string[];
};

export function RouteShell({
  title,
  route,
  description,
  bullets,
}: RouteShellProps) {
  return (
    <section className="route-shell">
      <span className="route-shell__tag">{route}</span>
      <h2 className="route-shell__title">{title}</h2>
      <p className="route-shell__copy">{description}</p>
      <ul className="route-shell__list">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
