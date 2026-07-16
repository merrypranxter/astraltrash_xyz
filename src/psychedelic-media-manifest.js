/*
  PSYCHEDELIC MEDIA MANIFEST

  AI Studio: populate these arrays from the actual objects beneath:
  gs://astraltrash_other/psychedelic/

  Do not leave Google Cloud Console URLs in the public page. Each `url` must be
  a browser-loadable object URL, public CDN URL, or an existing application
  proxy URL. The bucket currently permits object access only according to its
  own IAM/CORS rules; anonymous bucket listing is not available.

  Supported type values: image, video, audio, file.
  If `type` is omitted, the archive renderer infers it from the file extension.
*/

export const PSYCHEDELIC_MEDIA_ROOT = "gs://astraltrash_other/psychedelic/";

export const PSYCHEDELIC_MEDIA = {
  tetragrammaton: [
    {
      url: "https://storage.googleapis.com/astraltrash_other/psychedelic/tetratrammaton/media/The_Geometry_of_the_Impossible.mp4",
      type: "video",
      alt: "The Geometry of the Impossible",
      caption: "THE GEOMETRY OF THE IMPOSSIBLE",
    },
    {
      url: "https://storage.googleapis.com/astraltrash_other/psychedelic/tetratrammaton/media/7OHBDZXRNAV6M.m4a",
      type: "audio",
      alt: "7OHBDZXRNAV6M Audio Fragment",
      caption: "AUDIO FRAGMENT // 7OHBDZXRNAV6M",
    },
    {
      url: "https://storage.googleapis.com/astraltrash_other/psychedelic/tetratrammaton/media/Time,_Space,_and_Higher_Dimensions_Are_Mental_Categories.m4a",
      type: "audio",
      alt: "Time, Space, and Higher Dimensions Are Mental Categories",
      caption: "AUDIO FRAGMENT // TIME, SPACE, AND HIGHER DIMENSIONS ARE MENTAL CATEGORIES",
    }
  ],
  shipwrekt: [],
  "nine-grams": [],
  "other-debris": [],
};

export const PSYCHEDELIC_RESEARCH = {
  tetragrammaton: [
    {
      label: "TESSERACT_CONSCIOUSNESS.PDF",
      kind: "PDF // 18.1 MB",
      url: "https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/psychedelic_page/tetragrammaton_section/info/Tesseract_Consciousness.pdf",
    },
    {
      label: "GEOMETRY_AND_STRUCTURAL_ANALYSIS.TXT",
      kind: "FIELD TEXT",
      url: "https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/psychedelic_page/tetragrammaton_section/info/Geometry_and_structural_analysis.txt",
    },
    {
      label: "PHENOMENAL_QUALITIES_TABLE.CSV",
      kind: "RESEARCH DATA",
      url: "https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/psychedelic_page/tetragrammaton_section/info/Properties%20and%20Models%20of%20Phenomenal%20Qualities%20and%20Higher%20Dimensions%20-%20Table%201.csv",
    },
  ],
};
