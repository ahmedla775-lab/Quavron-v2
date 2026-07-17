import { Image, Video } from "lucide-react";

export default function ProfileMedia() {

  return (

    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

      <div className="mb-6 flex items-center gap-3">

        <Image
          size={22}
          className="text-blue-400"
        />

        <h2 className="text-2xl font-bold text-white">

          Media

        </h2>

      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

        {Array.from({ length: 8 }).map((_, index) => (

          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-800"
          >

            <div className="flex h-full items-center justify-center">

              <Image
                size={42}
                className="text-slate-600"
              />

            </div>

            <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2">

              <Video
                size={16}
                className="text-white"
              />

            </div>

            <div className="absolute inset-0 bg-blue-600/0 transition group-hover:bg-blue-600/20" />

          </div>

        ))}

      </div>

    </div>

  );

}
