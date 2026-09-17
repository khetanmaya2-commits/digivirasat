import React from 'react';
import { User, Globe, Server, Database, Eye, HardDrive, ArrowDown, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AwsArchitectureDiagram() {
  return (
    <div className="rounded-2xl bg-[#16120E] border border-[#C5A059]/30 p-6 sm:p-10 text-[#FBF8F2] shadow-2xl relative overflow-hidden">
      {/* Background jaali pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none jaali-pattern" />

      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <span className="text-xs uppercase font-mono tracking-widest text-[#E9D7A5] bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
          Cloud Infrastructure Topology
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3">
          AWS Serverless Heritage Preservation Engine
        </h3>
        <p className="text-sm text-stone-400 mt-2">
          Secure, credential-less browser integration powered by Amazon API Gateway HTTP API, AWS Lambda, S3 presigned URLs, Amazon Rekognition, and Amazon DynamoDB.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
        {/* Tier 1: Client Layer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#1F1813] border border-stone-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#C5A059]/15 text-[#E9D7A5]">
              <User size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Visitor / Tourist</h4>
              <p className="text-xs text-stone-400">Captures on-site photograph of heritage monument</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1F1813] border border-[#C5A059]/30 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#C5A059]/15 text-[#E9D7A5]">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">React 19 / Vite Application</h4>
              <p className="text-xs text-stone-400">Zero AWS credentials in frontend code &bull; Presigned PUT transfers</p>
            </div>
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-[#C5A059]">
          <ArrowDown size={24} className="animate-bounce" />
        </div>

        {/* Tier 2: Gateway & Compute */}
        <div className="p-5 rounded-xl bg-[#1F1813] border border-[#C5A059]/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-[#E9D7A5]">
              <Server size={22} />
            </div>
            <div>
              <span className="text-xs font-mono text-[#C5A059]">AWS ap-south-1</span>
              <h4 className="text-base font-bold text-white">Amazon API Gateway & AWS Lambda Microservices</h4>
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Dispatches requests across three core serverless endpoints: <code className="text-[#E9D7A5] font-mono">POST /uploads/presign</code>, <code className="text-[#E9D7A5] font-mono">POST /analyze</code>, and <code className="text-[#E9D7A5] font-mono">GET /analysis/{'{analysisId}'}</code>.
          </p>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-[#C5A059]">
          <ArrowDown size={24} />
        </div>

        {/* Tier 3: Core AWS Storage & ML Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* S3 */}
          <div className="p-4 rounded-xl bg-[#1F1813] border border-stone-800 space-y-2 hover:border-[#C5A059] transition-colors">
            <div className="flex items-center gap-2.5 text-[#E9D7A5]">
              <HardDrive size={20} />
              <h5 className="text-sm font-bold">Amazon S3</h5>
            </div>
            <p className="text-[11px] font-mono text-[#C5A059]">digivirasat-heritage-data-2026</p>
            <p className="text-xs text-stone-400">
              Stores private calibrated baseline benchmarks (2016) and direct visitor observation uploads via presigned URLs.
            </p>
          </div>

          {/* Rekognition */}
          <div className="p-4 rounded-xl bg-[#1F1813] border border-stone-800 space-y-2 hover:border-[#C5A059] transition-colors">
            <div className="flex items-center gap-2.5 text-[#E9D7A5]">
              <Eye size={20} />
              <h5 className="text-sm font-bold">Amazon Rekognition</h5>
            </div>
            <p className="text-[11px] font-mono text-[#C5A059]">Computer Vision AI</p>
            <p className="text-xs text-stone-400">
              Performs label detection and feature extraction to identify visual variations between historical and current captures.
            </p>
          </div>

          {/* DynamoDB */}
          <div className="p-4 rounded-xl bg-[#1F1813] border border-stone-800 space-y-2 hover:border-[#C5A059] transition-colors">
            <div className="flex items-center gap-2.5 text-[#E9D7A5]">
              <Database size={20} />
              <h5 className="text-sm font-bold">Amazon DynamoDB</h5>
            </div>
            <p className="text-[11px] font-mono text-[#C5A059]">DigiVirasatAnalyses</p>
            <p className="text-xs text-stone-400">
              Maintains persistent, immutable preservation records, priority rankings, condition states, and conservation notes.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-start gap-3 text-xs text-[#E9D7A5]">
          <ShieldCheck size={20} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
          <div>
            <strong>Zero Frontend Credentials Guarantee:</strong> The client never accesses AWS S3 or DynamoDB directly with IAM keys. All uploads use cryptographically scoped presigned URLs generated server-side with strict 300-second expiration.
          </div>
        </div>
      </div>
    </div>
  );
}
