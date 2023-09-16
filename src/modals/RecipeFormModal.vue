<template>
  <v-card class="pa-6 ma-4">
    <v-card-title class="text-h5">{{ isEdit ? 'Edit' : 'Create' }} Recipe</v-card-title>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Name"
        v-model="nameField.value.value"
        :counter="255"
        :error-messages="nameField.errorMessage.value"
      />

      <ImagePicker class="ma-4" v-model="imageUrlField.value.value" height="250" />

      <TimeSelector class="mb-2" label="Time" v-model="timeField.value.value" />

      <v-text-field
        label="Feeds"
        type="number"
        v-model="peopleCountField.value.value"
        :error-messages="peopleCountField.errorMessage.value"
      />

      <v-combobox
        label="Tags"
        v-model="tagsField.value.value"
        chips
        multiple
        clearable
        closable-chips
        :error-messages="tagsField.errorMessage.value"
      />

      <!-- ingredients -->
      <v-divider class="my-4" />
      <h2>Ingredients</h2>
      <v-list>
        <v-list-item
          class="pa-0"
          v-for="(field, index) in ingredientsArrayField.fields.value"
          :key="field.key"
        >
          <v-text-field
            :name="`ingredients[${index}]`"
            v-model="field.value"
            :counter="255"
            placeholder="next ingredient"
            :error-messages="ingredientsArrayField.errors.value[index]"
          >
            <template #append>
              <v-icon title="Remove Ingredient" @click="ingredientsArrayField.remove(index)">
                mdi-delete
              </v-icon>
            </template>
          </v-text-field>
        </v-list-item>
      </v-list>
      <v-btn color="primary" @click="ingredientsArrayField.push('')">Add Ingredient</v-btn>

      <!-- steps -->
      <v-divider class="my-4" />
      <h2>Steps</h2>

      <v-list>
        <draggable
          v-model="stepsArrayField.fields.value"
          handle=".handle"
          item-key="key"
          :animation="200"
        >
          <template #item="{ element: field }">
            <v-list-item class="step-border my-3 pa-0 py-2" :key="field.key">
              <template #prepend>
                <v-icon class="handle ma-auto" size="x-large">mdi-menu</v-icon>
              </template>
              <v-textarea
                :name="`step[${field.key}]`"
                v-model="field.value.text"
                :counter="1024"
                placeholder="next step"
                auto-grow
                tabindex="-1"
                :error-messages="stepsArrayField.errors.value[field.key]"
              >
                <template #append>
                  <v-icon title="Remove Step" @click="stepsArrayField.remove(field.key)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-textarea>
              <div class="d-flex">
                <ImagePicker
                  class="ma-1"
                  v-for="(_, index) in field.value.imageUrls"
                  :key="index"
                  no-icons
                  v-model="field.value.imageUrls[index]"
                  height="100"
                  width="100"
                  @cleared="field.value.imageUrls.splice(index, 1)"
                />

                <!-- Add new picker -->
                <ImagePicker
                  class="ma-1"
                  no-icons
                  height="100"
                  width="100"
                  @update:model-value="onNewImage(field.value.imageUrls, $event)"
                />
              </div>
            </v-list-item>
          </template>
        </draggable>
      </v-list>

      <v-btn color="primary" @click="stepsArrayField.push({ text: '', imageUrls: [] })">
        Add Step
      </v-btn>
      <v-divider class="my-4" />
      <v-btn type="submit" color="primary" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useModal, useModalController } from '@/composables/modal';
import { RecipeContent, RecipeStep } from '@/types/recipe';
import { useField, useForm } from 'vee-validate';
import { onMounted } from 'vue';
import { computed } from 'vue';
import * as yup from 'yup';
import ImagePicker from '@/components/ImagePicker.vue';
import { useArrayField } from '@/composables/useArrayField';
import TimeSelector from '@/components/TimeSelector.vue';
import { TimeComponents } from '@/types/time';
import draggable from 'vuedraggable';
import { useToast } from 'vue-toast-notification';
import { useCreateRecipe, useUpdateRecipe } from '@/composables/api/recipes';

const props = defineProps<{ id?: string; content?: RecipeContent }>();

const toast = useToast();
const modalController = useModalController();

const { createRecipe } = useCreateRecipe();
const { updateRecipe } = useUpdateRecipe();

const modal = useModal();

const isEdit = computed(() => !!props.id);

const schema = yup.object({
  name: yup.string().required().max(255),
  imageUrl: yup.string().nullable(),
  peopleCount: yup
    .number()
    .transform(v => (Number.isNaN(v) ? null : v))
    .min(0)
    .integer()
    .nullable(),
  tags: yup.array().of(yup.string().required().max(64)),
  ingredients: yup.array().of(yup.string().max(255).label('Ingredient')),
});

const form = useForm<yup.InferType<typeof schema>>({
  validationSchema: schema,
});

const nameField = useField<string>('name');
const imageUrlField = useField<string>('coverImageUrl');
const timeField = useField<TimeComponents | undefined>('time', undefined, {
  initialValue: { hour: 0, minute: 0 },
});
const peopleCountField = useField<number | undefined>('peopleCount', undefined, {
  initialValue: 0,
});
const tagsField = useField<string[]>('tags');
const ingredientsArrayField = useArrayField<string>('ingredients');
const stepsArrayField = useArrayField<RecipeStep>('steps');

const onSubmit = form.handleSubmit(async () => {
  const resp: RecipeContent = {
    name: nameField.value.value,
    imageUrl: imageUrlField.value.value,
    time: timeField.value.value,
    peopleCount: peopleCountField.value.value,
    tags: tagsField.value.value,
    ingredients: ingredientsArrayField.rawValues.value.filter(s => !!s),
    steps: stepsArrayField.rawValues.value,
  };

  // Enforce undefined as default for blank
  Object.entries(resp).forEach(([key, value]) => {
    (resp as any)[key] = value ?? undefined;
  });

  if (isEdit.value) {
    modalController.showLoading({ title: 'Creating Recipe' });
    await submitUpdate(resp);
  } else {
    modalController.showLoading({ title: 'Updating Recipe' });
    await submitCreate(resp);
  }

  modalController.hideLoading();
});

const submitUpdate = async (content: RecipeContent) => {
  await updateRecipe.mutateAsync(
    { id: props.id!, content },
    {
      onSuccess: () => {
        toast.success('Recipe Updated')!;
        modal.close('updated');
      },
      onError: () => {
        toast.error('Unable to update recipe at this time', { duration: 3000 });
      },
    },
  );
};

const submitCreate = async (content: RecipeContent) => {
  await createRecipe.mutateAsync(content, {
    onSuccess: () => {
      toast.success('Recipe Created')!;
      modal.close('created');
    },
    onError: () => {
      toast.error('Unable to create recipe at this time', { duration: 3000 });
    },
  });
};

onMounted(() => {
  const content = props.content;

  ingredientsArrayField.setValue(['']);
  if (!content) {
    return;
  }

  const ingredients = content.ingredients.map(i => i);

  if (ingredients.length === 0) {
    ingredients.push('');
  }

  const steps: RecipeStep[] = content.steps.map(s => {
    return {
      text: s.text,
      imageUrls: s.imageUrls.map(u => u),
    };
  });

  if (steps.length === 0) {
    steps.push({ text: '', imageUrls: [] });
  }

  nameField.value.value = content.name;
  imageUrlField.value.value = content.imageUrl || '';
  tagsField.value.value = content.tags.map(t => t);
  timeField.value.value = { hour: content.time?.hour || 0, minute: content.time?.minute || 0 };
  peopleCountField.value.value = content.peopleCount || 0;
  ingredientsArrayField.setValue(ingredients);
  stepsArrayField.setValue(steps);
});

const onNewImage = (imageUrls: string[], src?: string) => {
  if (src) {
    imageUrls.push(src);
  }
};
</script>

<style scoped>
.step-border {
  border: 1px dashed grey;
}

.flip-list-move {
  transition: transform 0.5s;
}
</style>
