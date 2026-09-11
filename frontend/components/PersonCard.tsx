import Image from "next/image";

import type { Person } from "@/app/about/data";

export function PersonCard({ person }: { person: Person }) {
  const typeLabels: Record<Person["type"], string> = {
    executive: "Bureau exécutif",
    member: "Membre",
    volunteer: "Bénévole",
  };

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#dfe7df] bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="p-5">
        <span className="inline-flex rounded-full bg-[#eaf6ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0c7af8]">
          {typeLabels[person.type]}
        </span>

        <h3 className="mt-4 text-xl font-semibold text-[#070707]">{person.name}</h3>
        <p className="mt-1 text-sm font-medium uppercase tracking-[0.12em] text-[#0c7af8]">
          {person.role}
        </p>

        {person.description ? (
          <p className="mt-3 text-sm leading-7 text-[#526057]">{person.description}</p>
        ) : null}
      </div>
    </article>
  );
}
