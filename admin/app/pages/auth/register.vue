<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :title="t('signup')"
        :description="t('auth.signup.description')"
        icon="lucide:user-plus"
        :fields="fields"
        :submit="{
          label: t('signup.submit'),
          variant: 'subtle',
          size: 'xl'
        }"
        loading-auto
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { AuthUser } from '~/types/auth'

const { t } = useI18n()

const fields: AuthFormField[] = [
  {
    name: 'name',
    label: t('name'),
    type: 'text',
    placeholder: t('placeholder.name'),
    required: true,
    size: 'xl'
  },
  {
    name: 'email',
    type: 'email',
    label: t('email'),
    placeholder: t('placeholder.email'),
    required: true,
    size: 'xl'
  },
  {
    name: 'password',
    label: t('password'),
    type: 'password',
    placeholder: t('placeholder.password'),
    required: true,
    size: 'xl'
  }
]

const schema = z.object({
  name: z.string('Name is required').min(3),
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(6, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const config = useRuntimeConfig()

const notify = useNotification()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await $fetch<{ user: AuthUser; accessToken: string; refreshToken: string }>('signup', {
      baseURL: `${config.public.apiUrl}/auth`,
      method: 'POST',
      body: {
        name: payload.data.name,
        email: payload.data.email,
        password: payload.data.password
      },
      credentials: 'include'
    })

    navigateTo({ name: 'auth-login' })
  } catch (err: unknown) {
    // Get status code from error
    const statusCode = (err as { statusCode?: number })?.statusCode

    // Notify error
    notify.error({
      description:
        statusCode === 401
          ? t('notification.error.401')
          : (err as { data?: { message?: string } })?.data?.message
    })
  }
}
</script>
