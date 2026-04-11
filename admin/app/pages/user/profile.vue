<template>
  <NuxtLayout name="panel">
    <UForm :schema="schema" :state="profile" class="space-y-4" @submit="onSubmit">
      <UPageCard :title="t('profile')" variant="naked" orientation="horizontal" />

      <UPageCard variant="subtle">
        <UFormField name="name" :label="t('name')" required>
          <UInput v-model="profile.name" autocomplete="off" size="xl" class="w-full" />
        </UFormField>

        <UFormField name="email" :label="t('email')" required>
          <UInput
            v-model="profile.email"
            type="email"
            autocomplete="off"
            size="xl"
            class="w-full"
          />
        </UFormField>

        <UFormField name="password" :label="t('password')">
          <UInput
            v-model="profile.password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            size="xl"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                :aria-label="showPassword ? t('hide.password') : t('show.password')"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
      </UPageCard>

      <div class="flex justify-end">
        <UButton type="submit" :label="t('save.changes')" variant="soft" class="w-fit lg:ms-auto" />
      </div>
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { t } = useI18n()

const schema: z.ZodType<ModelInput<AuthUser>> = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6).optional()
})

const authStore = useAuthStore()
const { authUser } = storeToRefs(authStore)

type Schema = z.output<typeof schema>

const profile = reactive<Partial<Schema>>({ ...authUser.value }!)

const showPassword = ref(false)

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
