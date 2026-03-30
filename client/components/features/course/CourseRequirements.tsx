interface CourseRequirementsProps {
  requirements: string[]
}

export function CourseRequirements({ requirements }: CourseRequirementsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Նախապայմաններ</h2>
      <ul className="list-disc pl-5 space-y-2 marker:text-violet-600">
        {requirements.map((req, i) => (
          <li key={i} className="text-slate-700 font-medium">
            {req}
          </li>
        ))}
      </ul>
    </div>
  )
}

