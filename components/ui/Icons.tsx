import type { SVGProps } from "react";

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.5 3.5a1 1 0 0 1 1.5-.866l9 5.5a1 1 0 0 1 0 1.732l-9 5.5A1 1 0 0 1 4.5 14.5z" />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5.5 0a1 1 0 0 1 1-1H14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function SkipBackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.5 4a.5.5 0 0 1 .5-.5h1A.5.5 0 0 1 6.5 4v4.382l7.276-4.366A.5.5 0 0 1 14 4.447v11.106a.5.5 0 0 1-.724.431L6.5 11.618V16a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

export function SkipForwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M15.5 4a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4.382l-7.276 4.366A.5.5 0 0 1 6 15.553V4.447a.5.5 0 0 1 .724-.431L14 8.382V4.5a.5.5 0 0 1 .5-.5z" />
    </svg>
  );
}

export function VolumeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.157 3.1a.75.75 0 0 1 1.093.659v12.482a.75.75 0 0 1-1.093.659L5.5 14.75H3.75A1.75 1.75 0 0 1 2 13V7A1.75 1.75 0 0 1 3.75 5.25H5.5z" />
      <path d="M13.443 6.557a.75.75 0 0 1 1.06 0 5 5 0 0 1 0 7.07.75.75 0 0 1-1.06-1.06 3.5 3.5 0 0 0 0-4.95.75.75 0 0 1 0-1.06z" />
      <path d="M14.854 5.146a.5.5 0 0 1 .707 0 6.5 6.5 0 0 1 0 9.192.5.5 0 0 1-.707-.708 5.5 5.5 0 0 0 0-7.776.5.5 0 0 1 0-.708z" />
    </svg>
  );
}
