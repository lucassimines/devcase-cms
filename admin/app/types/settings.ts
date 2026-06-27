export const SETTING_PROFILE_DEFAULT = {
  role: emptyLocalizedString(),
  location: emptyLocalizedString(),
  image: emptyLocalizedString()
}

export type SettingProfile = typeof SETTING_PROFILE_DEFAULT

export type SettingsData = {
  profile?: SettingProfile
}
