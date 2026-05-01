<template>
  <NuxtLayout name="panel">
    <UForm :schema="schema" :state="profile" class="space-y-4" @submit="onSubmit">
      <UPageCard :title="$t('profile')" variant="naked" orientation="horizontal" />

      <UPageCard variant="subtle">
        <UFormField name="name" :label="t('name')" required>
          <UInput v-model="profile.name" autocomplete="off" />
        </UFormField>

        <UFormField name="email" :label="t('email')" required>
          <UInput v-model="profile.email" type="email" autocomplete="off" />
        </UFormField>

        <UFormField name="password" :label="t('password')">
          <FieldPassword v-model="profile.password" />
        </UFormField>

        <UFormField name="passwordConfirm" :label="t('confirmPassword')">
          <FieldPassword v-model="passwordConfirm" />
        </UFormField>
      </UPageCard>

      <div class="flex justify-end">
        <UButton type="submit" :label="t('button.save')" variant="soft" class="w-fit lg:ms-auto" />
      </div>
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { AuthUser } from '~/types/auth'
import type { ModelInput } from '~/types/utils'

const { t } = useI18n()

type ProfileInput = ModelInput<AuthUser> & { passwordConfirm?: string }

const passwordConfirm = ref<string | undefined>(undefined)

const schema: z.ZodType<ProfileInput> = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z
      .string()
      .min(6)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: t('validation.password') })
      .optional(),
    passwordConfirm: z.string().min(6).optional()
  })
  .refine((data) => data.password === passwordConfirm.value, {
    error: "Passwords don't match",
    path: ['passwordConfirm'] // path of error
  })

const authStore = useAuthStore()
const { authUser } = storeToRefs(authStore)

type Schema = z.output<typeof schema>

const profile = reactive<Partial<Schema>>({ ...authUser.value }!)

const notify = useNotification()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await $adminApi<AuthUser>('/user/profile', {
      method: 'PUT',
      body: event.data
    })

    if (res) {
      authStore.setAuthUser(res)

      notify.success()

      return
    }
  } catch {
    notify.error()
  }
}
</script>
