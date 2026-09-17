import React from 'react';

const HeritageTitle = ({
  title = 'SHEESH MAHAL',
  subtitle = 'पूर्वी शीशा दीवार',
  image,
  year = '18TH CENTURY',
  location = 'AMER FORT • JAIPUR',
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#241712] rounded-3xl">

      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(200,157,102,0.18) 0 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative min-h-[620px] sm:min-h-[700px] flex flex-col justify-between p-6 sm:p-10 lg:p-14">

        {/* Top metadata */}
        <div className="relative z-20 flex flex-wrap items-start justify-between gap-4">

          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#E9D7A5]">
              Heritage Element
            </p>

            <p className="text-sm font-hindi text-[#C89D66] mt-1">
              विरासत तत्व
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-400">
              {year}
            </p>

            <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#C89D66] mt-1">
              {location}
            </p>
          </div>

        </div>


        {/* Image typography */}
        <div className="relative flex-1 flex items-center justify-center py-12">

          <div className="relative w-full">

            {/* Main image behind the typography */}
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            {/* Dark image overlay */}
            <div className="absolute inset-0 bg-[#241712]/30" />


            {/* Huge title with image clipped inside text */}
            <h1
              className="
                relative
                text-center
                font-serif
                font-black
                uppercase
                leading-[0.78]
                tracking-[-0.06em]
                text-[17vw]
                sm:text-[15vw]
                lg:text-[13vw]
                xl:text-[11vw]
                bg-cover
                bg-center
                bg-clip-text
                text-transparent
                select-none
              "
              style={{
                backgroundImage: `url(${image})`,
              }}
            >
              {title}
            </h1>

          </div>

        </div>


        {/* Bottom information */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">

          <div>
            <div className="h-px w-16 bg-[#C5A059] mb-4" />

            <p className="text-xs uppercase tracking-[0.3em] text-[#C89D66]">
              Document • Remember • Preserve
            </p>

            <p className="text-sm text-stone-400 mt-2 max-w-md leading-relaxed">
              A living digital record of architectural heritage,
              documented across time.
            </p>
          </div>


          <div className="sm:text-right">

            <h2 className="text-xl sm:text-2xl font-serif text-[#E9D7A5]">
              {title}
            </h2>

            <p className="font-hindi text-sm text-[#C89D66] mt-1">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HeritageTitle;