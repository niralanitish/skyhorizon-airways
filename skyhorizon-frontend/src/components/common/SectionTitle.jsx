function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-14">

      <h2 className="text-4xl font-bold text-slate-900">

        {title}

      </h2>

      <p className="mt-3 text-slate-500">

        {subtitle}

      </p>

    </div>
  );
}

export default SectionTitle;