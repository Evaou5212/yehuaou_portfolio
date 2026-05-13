import { motion } from 'motion/react';
import { Eye, Users } from 'lucide-react';

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200 selection:text-black">
      
      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Background Image - Replace src with your actual project image */}
        <div className="absolute inset-0 z-0">
           <img src="/hero.jpg" alt="Project Hero" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl mx-auto text-white"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light tracking-tight mb-6 leading-[0.9]">
            The Algorithmic Garden
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
            A speculative animation exploring the hidden costs of a perfect society.
          </p>
        </motion.div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* Project Overview (Split Layout) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pb-16">
          {/* Left Column: Metadata */}
          <div className="md:col-span-4 space-y-8 sticky top-32">
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Project Type</h3>
              <p className="text-xl font-medium">Speculative 3D Animation</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Tools</h3>
              <p className="text-xl font-medium">Blender, Premiere Pro</p>
            </div>
          </div>
          
          {/* Right Column: Intro & Question */}
          <div className="md:col-span-8 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight">
              In a world where nature is lush and order is absolute, what happens to those who no longer fit the algorithm?
            </h2>
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
              <p>
                "The Algorithmic Garden" visualizes a technologically advanced utopian society where the price of peace is absolute conformity. Inspired by the Panopticon theory and Kurt Vonnegut’s <em>Harrison Bergeron</em>, the project reveals a world where lush vegetation conceals cold mechanisms of control.
              </p>
              <p>
                The narrative follows an elderly man deemed "unfit" by the societal algorithm. Faced with a forced choice between euthanasia and body donation, his loyal dog triggers a final, fleeting act of emotional resistance. Through symbolic visual storytelling—featuring faceless puppets, surveillance towers disguised by foliage, and cages hidden in plain sight—the piece invites viewers to question the erasure of individuality in the face of algorithmic perfection.
              </p>
            </div>
          </div>
        </section>

        {/* Theoretical Framework (Vertical Full Width) */}
        <section className="space-y-16">
          <h2 className="text-4xl font-serif pb-4">Theoretical Framework</h2>
          
          {/* Theory 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="flex items-center gap-4 text-gray-400">
                <Eye size={24} />
                <span className="text-sm font-mono uppercase tracking-widest">Surveillance</span>
              </div>
              <h3 className="text-3xl font-medium">The Panopticon Effect</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Based on Jeremy Bentham's concept, the society functions on the principle of constant visibility. Citizens regulate their own behavior under the assumption they are always being watched. In this "Garden," the surveillance is organic—hidden within the leaves and trees—creating a self-disciplining society where resistance is psychologically impossible before it is physically stopped.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-[4/3] bg-gray-100 overflow-hidden relative">
               <img src="/theory1.jpg" alt="Panopticon Theory" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Theory 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 space-y-6">
              <div className="flex items-center gap-4 text-gray-400">
                <Users size={24} />
                <span className="text-sm font-mono uppercase tracking-widest">Behavior</span>
              </div>
              <h3 className="text-3xl font-medium">The "Universe 25" Warning</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Drawing from John Calhoun’s "Mice Utopia" experiment, the project explores the social collapse that comes from resource abundance coupled with lack of purpose. The "Puppets" in the animation represent the end-state of this utopia: individuals who have all needs met but have become mere cogs in the machine, stripped of the struggle that defines humanity.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-[4/3] bg-gray-100 overflow-hidden relative">
               <img src="/theory2.jpg" alt="Universe 25 Theory" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Visual Metaphors Gallery */}
        <section className="space-y-16">
          <h2 className="text-4xl font-serif pb-4">Visual Metaphors</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. The Panopticon Living Space */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/panopticon.jpg" alt="The Panopticon Living Space" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">The Panopticon Living Space</h4>
                <p className="text-gray-600 leading-relaxed">
                  Inspired by the idea of the Panopticon. People living in this space are used to being constantly visible and being forced to be self-disciplined.
                </p>
              </div>
            </div>

            {/* 2. The Watchtower */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/tower.jpg" alt="The Watchtower" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">The Watchtower</h4>
                <p className="text-gray-600 leading-relaxed">
                  The tower functions as a sentinel in the utopian world—always watching, always ready to correct.
                </p>
              </div>
            </div>

            {/* 3. The Mirror & The Cages */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/mirror.jpg" alt="The Mirror & The Cages" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">The Mirror & The Cages</h4>
                <p className="text-gray-600 leading-relaxed">
                  The mirror represents a moment of introspection and a possibility of self-awareness. Positioned next to the cages, it questions whether the inhabitants of this society can see themselves clearly.
                </p>
              </div>
            </div>

            {/* 4. The Puppets */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/puppets.jpg" alt="The Puppets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">The Puppets</h4>
                <p className="text-gray-600 leading-relaxed">
                  They represent standardized citizens in a controlled utopian society—individuals who appear human but have been stripped of their autonomy. Standing in uniform posture, they evoke a sense of sameness and compliance.
                </p>
              </div>
            </div>

            {/* 5. Surveillance Monitor and Puppet */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/monitor.jpg" alt="Surveillance Monitor and Puppet" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">Surveillance Monitor and Puppet</h4>
                <p className="text-gray-600 leading-relaxed">
                  The rigid, faceless puppet and cold machinery together reflect the subtle loss of personal identity within technological oversight. Raising questions about whether autonomy remains when behavior is constantly "observed for safety."
                </p>
              </div>
            </div>

            {/* 6. Puppets trapped in Cages */}
            <div className="group space-y-4">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="/cages.jpg" alt="Puppets trapped in Cages" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <h4 className="text-2xl font-medium mb-2">Puppets trapped in Cages</h4>
                <p className="text-gray-600 leading-relaxed">
                  In a hyper-ordered utopia, individuality is tolerated only within very tight boundaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Section */}
        <section className="space-y-16">
          <h2 className="text-4xl font-serif pb-4">Environment Design</h2>

          <div className="w-full space-y-4">
            <div className="aspect-[21/9] bg-gray-100 overflow-hidden relative shadow-sm">
              <img src="/nature.jpg" alt="Nature as Disguise" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="max-w-3xl">
              <h4 className="text-2xl font-medium mb-2">Nature as Disguise</h4>
              <p className="text-gray-600 leading-relaxed">
                The lush environment is not a sign of freedom, but a mask. By blending machinery with organic forms, the system disguises oppression as beauty, making rebellion feel like a violation of nature itself.
              </p>
            </div>
          </div>
        </section>

        {/* Final Form Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-serif pb-4">Final Form</h2>
          <div className="space-y-8">
            <div className="w-full aspect-[21/9] bg-gray-100 overflow-hidden relative shadow-sm">
               <img src="/finalform1.jpg" alt="Final Form Render" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="aspect-video bg-gray-100 overflow-hidden relative shadow-sm">
                 <img src="/finalform2.jpg" alt="Final Form Detail" className="w-full h-full object-cover" />
               </div>
               <div className="aspect-video bg-gray-100 overflow-hidden relative shadow-sm">
                 <img src="/finalform3.jpg" alt="Final Form Detail" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </section>

        {/* Reflection */}
        <section className="max-w-4xl mx-auto text-center space-y-6 pt-12">
          <h2 className="text-3xl font-serif">Reflection</h2>
          <div className="text-gray-600 leading-relaxed text-lg space-y-4">
            <p>
              This project was an exercise in visual storytelling over traditional narrative. Due to time constraints, the planned "Dystopia" scene was condensed, forcing a pivot to a more symbolic approach.
            </p>
            <p>
              Focusing on the environment as the main character allowed for a more subtle critique. The static nature of the puppets and the stillness of the scene emphasize the stagnation of this "perfect" world, while the unfinished nature of the resistance mirrors the futility of the character's struggle.
            </p>
          </div>
        </section>

        {/* Video Showcase (Moved to End) */}
        <section className="space-y-8">
          <h2 className="text-3xl font-serif text-center">Final Animation</h2>
          <div className="w-full aspect-video bg-black overflow-hidden shadow-2xl relative group">
            <video 
              className="w-full h-full object-cover" 
              controls 
              poster="/garden.jpg"
            >
              <source src="/utopia_final.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 text-center text-gray-400 text-sm">
        <p>&copy; 2025 Eva Yehua Ou. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
