/**
 * Resume Upload Page
 * Job seeker resume upload and profile creation
 */

import { ResumeUploadForm } from '@/components/forms/jobseeker/ResumeUploadForm'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-text-light">
            Get discovered by top employers and recruiters. Your journey starts here.
          </p>
        </div>

        <ResumeUploadForm />
      </div>
    </div>
  )
}
