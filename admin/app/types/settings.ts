export const SETTING_PROFILE_DEFAULT = {
  name: '',
  role: emptyLocalizedString(),
  location: emptyLocalizedString(),
  image: emptyLocalizedString(),
  resumeUrl: emptyLocalizedString(),
  email: ''
}

export type SettingProfile = typeof SETTING_PROFILE_DEFAULT

export type SettingsData = {
  profile?: SettingProfile
}
