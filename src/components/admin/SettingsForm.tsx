'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import ImageUploader from '@/components/admin/ImageUploader';
import type { SettingsFormState } from '@/app/admin/(panel)/settings/actions';

type SettingsFormProps = {
  action: (prevState: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
  initialValues: {
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    address: string;
    mapEmbedUrl: string;
    storyTitle: string;
    storyContent: string;
    storyImage: string;
    aboutBanner: string;
  };
};

const initialState: SettingsFormState = {};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function SettingsForm({ action, initialValues }: SettingsFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [storyImageUploading, setStoryImageUploading] = useState(false);
  const [aboutBannerUploading, setAboutBannerUploading] = useState(false);

  const uploading = storyImageUploading || aboutBannerUploading;

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Settings saved</p>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Contact details</h2>

        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-stone-700">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={initialValues.contactEmail}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
          <p className="mt-1 text-xs text-stone-500">
            Shown on the website. Contact form messages are sent to this address.
          </p>
        </div>

        <div>
          <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium text-stone-700">
            Phone
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            required
            defaultValue={initialValues.contactPhone}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>

        <div>
          <label htmlFor="whatsappNumber" className="mb-1 block text-sm font-medium text-stone-700">
            WhatsApp number
          </label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            type="text"
            required
            defaultValue={initialValues.whatsappNumber}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
          <p className="mt-1 text-xs text-stone-500">
            Digits with country code, for example 917550350009
          </p>
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium text-stone-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={initialValues.address}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Map</h2>

        <div>
          <label htmlFor="mapEmbedUrl" className="mb-1 block text-sm font-medium text-stone-700">
            Google Maps embed code
          </label>
          <textarea
            id="mapEmbedUrl"
            name="mapEmbedUrl"
            rows={3}
            defaultValue={initialValues.mapEmbedUrl}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
          <p className="mt-1 text-xs text-stone-500">
            On Google Maps choose Share, Embed a map, copy the HTML and paste it here.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Website content</h2>

        <div>
          <label htmlFor="storyTitle" className="mb-1 block text-sm font-medium text-stone-700">
            Story title
          </label>
          <input
            id="storyTitle"
            name="storyTitle"
            type="text"
            defaultValue={initialValues.storyTitle}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>

        <div>
          <label htmlFor="storyContent" className="mb-1 block text-sm font-medium text-stone-700">
            Story text
          </label>
          <textarea
            id="storyContent"
            name="storyContent"
            rows={4}
            defaultValue={initialValues.storyContent}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>

        <div>
          <ImageUploader
            name="storyImage"
            initialUrl={initialValues.storyImage || null}
            label="Story image"
            onUploadingChange={setStoryImageUploading}
            hint="Recommended 1200 x 900 px (4:3), JPG or WebP, max 1 MB"
          />
        </div>

        <div>
          <ImageUploader
            name="aboutBanner"
            initialUrl={initialValues.aboutBanner || null}
            label="About page banner"
            onUploadingChange={setAboutBannerUploading}
            hint="Recommended 1920 x 600 px, JPG or WebP, max 1 MB"
          />
        </div>
      </div>

      <SubmitButton disabled={uploading} />
    </form>
  );
}
