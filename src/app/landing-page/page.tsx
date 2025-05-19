import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/lib/components/ui/button';
import { Shield, Globe, Users, Zap, CheckCircle, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col size-full">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Streamline NIST 2.0 Compliance <span className="text-blue-600 dark:text-blue-400">Across Your Client Base</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Fortivector empowers MSPs to implement, track, and manage security controls across multiple clients with unprecedented efficiency and scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Book a Demo
                </Button>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/dashboard-preview.png"
                alt="Fortivector Dashboard"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDQIHq4C3FAAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6 md:px-10 lg:px-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Key Features</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Fortivector makes NIST 2.0 implementation scalable and efficient with our unique approach to security control management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-blue-100 dark:bg-blue-900">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Global Control Systems</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Create reusable control frameworks that can be applied across multiple clients and sites, ensuring consistency in your security implementations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Client Mapping</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Efficiently map controls to specific clients and sites, allowing tailored security implementations while maintaining global oversight.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">NIST 2.0 Compliance</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Built specifically for NIST Cybersecurity Framework 2.0, making it easy to stay current with the latest standards and requirements.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-purple-100 dark:bg-purple-900">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Implementation Acceleration</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Deploy security controls faster with templated implementations, checklists, and guided workflows across your entire client base.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-amber-100 dark:bg-amber-900">
                <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Compliance Tracking</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Real-time dashboards and reports to track compliance status across clients, highlighting gaps and progress in your security program.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg transition-all hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-red-100 dark:bg-red-900">
                <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Audit Readiness</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Generate audit-ready reports and evidence collections that demonstrate compliance with NIST and other regulatory frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 md:px-10 lg:px-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">How Fortivector Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our unique approach streamlines security control management for MSPs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Create Global Systems</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Design standardized security control systems based on NIST 2.0 that will serve as templates for client implementations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Map to Clients</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Apply your global systems to specific clients, customizing as needed while maintaining core compliance requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Track & Report</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Monitor implementation progress, gather evidence, and generate compliance reports across your entire client portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MSP Benefits Section */}
      <section className="py-16 px-6 md:px-10 lg:px-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">For MSPs, By MSPs</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Fortivector was built specifically to address the challenges MSPs face when implementing security controls across multiple clients.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Reduce time spent on repetitive security implementations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Scale your security practice without proportionally scaling staff</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Standardize security approaches across diverse client environments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Provide clear visibility into security posture across your client base</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Generate client-ready reports that demonstrate compliance</span>
                </li>
              </ul>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/msp-dashboard.png"
                alt="MSP Dashboard"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDQIHq4C3FAAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-10 lg:px-20 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Transform Your Security Practice?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join MSPs already using Fortivector to streamline NIST 2.0 compliance across their client base.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}


      {/* FAQ Section */}
      <section className="py-16 px-6 md:px-10 lg:px-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">How does Fortivector differ from other compliance tools?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Fortivector is specifically designed for MSPs managing multiple clients. Our unique global control systems approach allows you to create standardized security implementations that can be efficiently mapped and customized across your client base.
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Can Fortivector handle frameworks beyond NIST 2.0?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                While optimized for NIST 2.0, Fortivector supports multiple security frameworks including ISO 27001, CIS Controls, and CMMC. Our mapping feature allows controls to satisfy requirements across multiple frameworks simultaneously.
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">How quickly can we get started?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Most MSPs are up and running within a week. We provide pre-built NIST 2.0 control templates that you can immediately apply to your clients, allowing you to start showing value from day one.
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Does Fortivector integrate with our existing MSP tools?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Yes, Fortivector integrates with popular PSA and RMM tools, allowing you to connect client data, assign tasks, and streamline your workflow. We support ConnectWise, Datto, Kaseya, and many more integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-6 md:px-10 lg:px-20 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Start Your Security Transformation Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the growing community of MSPs using Fortivector to deliver exceptional security services at scale.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Get Started Now
          </Button>
        </div>
      </section>
    </main>
  );
}