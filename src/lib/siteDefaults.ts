export type SiteImages = {
  logo: string;
  heroImage: string;
  authorImage: string;
  defaultBanner: string;
  socialFacebookIcon: string;
  socialYoutubeIcon: string;
  socialInstagramIcon: string;
  socialEmailIcon: string;
  locationIcon: string;
  searchIcon: string;
  backToTopIcon: string;
  downloadIcon: string;
  youtubePlayIcon: string;
};

const CDN = "https://res.cloudinary.com/dx1gryhqc/image/upload";

export const DEFAULT_SITE_IMAGES: SiteImages = {
  logo: `${CDN}/v1758662209/Logo_ox1c8z.png`,
  heroImage: `${CDN}/v1759093412/humaqureshi_writerbanner_ajh5nx.png`,
  authorImage: `${CDN}/v1759093412/humaqureshi_writerbanner_ajh5nx.png`,
  defaultBanner: `${CDN}/v1759093412/humaqureshi_writerbanner_ajh5nx.png`,
  socialFacebookIcon: `${CDN}/v1758662209/facebook_vgnanl.png`,
  socialYoutubeIcon: `${CDN}/v1758664074/youtube_dpg3g8.png`,
  socialInstagramIcon: `${CDN}/v1758663992/instagram_mxjgaa.png`,
  socialEmailIcon: `${CDN}/v1758662225/mail_psqetd.png`,
  locationIcon: `${CDN}/v1758662210/location_o9fddb.png`,
  searchIcon: `${CDN}/v1758662209/search_a2yhvf.png`,
  backToTopIcon: `${CDN}/v1758662383/up-tertiary_yvuory.png`,
  downloadIcon: `${CDN}/v1758662209/download_tt1crr.png`,
  youtubePlayIcon: `${CDN}/v1760053180/youtube_play_pyhd8d.png`,
};

export const SITE_IMAGE_KEYS = Object.keys(DEFAULT_SITE_IMAGES) as (keyof SiteImages)[];
