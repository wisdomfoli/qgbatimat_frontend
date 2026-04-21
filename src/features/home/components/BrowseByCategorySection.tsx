import type { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router'
import * as ReactSlick from 'react-slick'
import type { Settings } from 'react-slick'

const sliderModule = ReactSlick as { default?: unknown }
const sliderRuntime = (sliderModule.default as { default?: unknown } | undefined)?.default ?? sliderModule.default
const hasValidSlider = typeof sliderRuntime === 'function'
const SliderComponent = sliderRuntime as ComponentType<Settings & { children?: ReactNode }>

const trendingCategories = [
  {
    title: 'Electronique reconditionne',
    slug: 'electronique',
    image: 'https://picsum.photos/seed/electronique-reconditionne/700/420',
  },
  {
    title: 'Velos',
    slug: 'velos',
    image: 'https://picsum.photos/seed/velos-tendance/700/420',
  },
  {
    title: 'Loisirs creatifs',
    slug: 'loisirs-creatifs',
    image: 'https://picsum.photos/seed/loisirs-creatifs/700/420',
  },
  {
    title: 'Vacances insolites',
    slug: 'vacances-insolites',
    image: 'https://picsum.photos/seed/vacances-insolites/700/420',
  },
]

export default function BrowseByCategorySection() {
  const sliderSettings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      // {
      //   breakpoint: 900,
      //   settings: {
      //     slidesToShow: 2.2,
      //     slidesToScroll: 1,
      //   },
      // },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {/* Desktop: static grid (lg and up) */}
        <div className="hidden grid-cols-5 gap-3 lg:grid">
          <div className="h-72 overflow-hidden rounded-xl bg-amber-50 p-6">
            <p className="max-w-36 text-xl font-bold leading-8 text-zinc-900 mb-2">Type de travaux</p>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-title="SvgFireFill" fill="currentColor" className="fill-current shrink-0 text-current size-7" data-spark-component="icon" aria-hidden="true" focusable="false"><path fillRule="evenodd" clipRule="evenodd" d="M10.5356 2.00049C10.7802 2.00049 11.0248 2.08138 11.2694 2.16226C16.8957 4.75069 20.1572 10.1702 19.9942 14.7808C19.9126 16.7221 19.2603 18.5826 17.8741 19.8768C16.488 21.171 14.531 21.9799 12.0848 21.9799C11.1063 22.0608 10.1279 21.899 9.14939 21.5754C8.17092 21.2519 7.27398 20.6857 6.54013 20.0386C5.80627 19.3915 5.15395 18.5826 4.74626 17.6928C4.25702 16.7221 4.0124 15.7515 4.0124 14.7808C3.93086 13.6484 4.25702 12.516 4.8278 11.4644C5.39857 10.4129 6.21397 9.60398 7.27398 9.03776C7.5186 8.87599 7.76322 8.87599 8.08938 8.95687C8.41554 9.03776 8.57862 9.28043 8.66016 9.4422C8.98631 10.0893 9.31247 10.7364 9.80171 11.2217C10.2909 10.4129 10.5356 9.4422 10.5356 8.30977C10.5356 6.85378 10.1279 5.31691 9.31247 3.94181C9.14939 3.69914 9.06785 3.37559 9.14939 3.05203C9.23093 2.72848 9.39401 2.48582 9.63863 2.32404L9.72017 2.24315C9.96479 2.08138 10.2909 2.00049 10.5356 2.00049ZM15.4279 17.3692C14.6941 18.0972 13.7156 18.5017 12.7371 18.5017C12.1664 18.5017 11.7587 18.0972 11.7587 17.531C11.7587 16.9648 12.1664 16.5603 12.7371 16.5603C13.2264 16.5603 13.7156 16.3177 14.0418 15.9941C14.4495 15.6706 14.6126 15.1852 14.6126 14.6999C14.6126 14.1337 15.0203 13.7292 15.591 13.7292C16.1618 13.7292 16.5695 14.1337 16.5695 14.6999C16.5695 15.7515 16.1618 16.6412 15.4279 17.3692Z"></path></svg>
          </div>
          {trendingCategories.map((category) => (
            <Link
              key={category.title}
              to={`/produits?categorie=${category.slug}`}
              className="group relative block h-72 overflow-hidden rounded-xl md:h-72"
            >
              <img
                src={category.image}
                alt={category.title}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-4 flex items-end">
                <p className="max-w-40 text-xl font-semibold leading-8 text-white">{category.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {hasValidSlider ? (
          <div className="lg:hidden">
            <p className="mb-3 text-xl font-bold uppercase tracking-wide text-zinc-700 md:hidden">
              Type de travaux
            </p>
            {/* Runtime guard for react-slick ESM/CJS interop differences */}
            <div className="md:hidden">
              <SliderComponent {...sliderSettings} className="trending-slider">
                {trendingCategories.map((category) => (
                  <div key={category.title} className="h-72 px-1">
                    <Link
                      to={`/produits?categorie=${category.slug}`}
                      className="group relative block h-full overflow-hidden rounded-xl"
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 p-4 flex items-end">
                        <p className="max-w-40 text-xl font-semibold leading-8 text-white">{category.title}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </SliderComponent>
            </div>
            <div className="hidden md:block">
              <SliderComponent {...sliderSettings} className="trending-slider">
                <div className="h-72 px-1">
                  <div className="h-full overflow-hidden rounded-xl bg-amber-50 p-6">
                    <p className="max-w-36 text-xl font-bold leading-8 text-zinc-900 mb-2">Type de travaux</p>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-title="SvgFireFill" fill="currentColor" className="fill-current shrink-0 text-current size-7" data-spark-component="icon" aria-hidden="true" focusable="false"><path fillRule="evenodd" clipRule="evenodd" d="M10.5356 2.00049C10.7802 2.00049 11.0248 2.08138 11.2694 2.16226C16.8957 4.75069 20.1572 10.1702 19.9942 14.7808C19.9126 16.7221 19.2603 18.5826 17.8741 19.8768C16.488 21.171 14.531 21.9799 12.0848 21.9799C11.1063 22.0608 10.1279 21.899 9.14939 21.5754C8.17092 21.2519 7.27398 20.6857 6.54013 20.0386C5.80627 19.3915 5.15395 18.5826 4.74626 17.6928C4.25702 16.7221 4.0124 15.7515 4.0124 14.7808C3.93086 13.6484 4.25702 12.516 4.8278 11.4644C5.39857 10.4129 6.21397 9.60398 7.27398 9.03776C7.5186 8.87599 7.76322 8.87599 8.08938 8.95687C8.41554 9.03776 8.57862 9.28043 8.66016 9.4422C8.98631 10.0893 9.31247 10.7364 9.80171 11.2217C10.2909 10.4129 10.5356 9.4422 10.5356 8.30977C10.5356 6.85378 10.1279 5.31691 9.31247 3.94181C9.14939 3.69914 9.06785 3.37559 9.14939 3.05203C9.23093 2.72848 9.39401 2.48582 9.63863 2.32404L9.72017 2.24315C9.96479 2.08138 10.2909 2.00049 10.5356 2.00049ZM15.4279 17.3692C14.6941 18.0972 13.7156 18.5017 12.7371 18.5017C12.1664 18.5017 11.7587 18.0972 11.7587 17.531C11.7587 16.9648 12.1664 16.5603 12.7371 16.5603C13.2264 16.5603 13.7156 16.3177 14.0418 15.9941C14.4495 15.6706 14.6126 15.1852 14.6126 14.6999C14.6126 14.1337 15.0203 13.7292 15.591 13.7292C16.1618 13.7292 16.5695 14.1337 16.5695 14.6999C16.5695 15.7515 16.1618 16.6412 15.4279 17.3692Z"></path></svg>
                  </div>
                </div>
                {trendingCategories.map((category) => (
                  <div key={category.title} className="h-72 px-1">
                    <Link
                      to={`/produits?categorie=${category.slug}`}
                      className="group relative block h-full overflow-hidden rounded-xl"
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 p-4 flex items-end">
                        <p className="max-w-40 text-xl font-semibold leading-8 text-white">{category.title}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </SliderComponent>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-700 sm:col-span-2">
              Type de travaux
            </p>
            {trendingCategories.map((category) => (
              <Link
                key={category.title}
                to={`/produits?categorie=${category.slug}`}
                className="group relative block h-72 overflow-hidden rounded-xl"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-4 flex items-end">
                  <p className="max-w-40 text-xl font-semibold leading-8 text-white">{category.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
