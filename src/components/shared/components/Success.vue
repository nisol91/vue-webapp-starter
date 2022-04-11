<template>
  <div>
    <div class="text-center success">
      <i class="far fa-thumbs-up"></i>
      <h1 class="mt-4">good!</h1>
      <h3>Success!!</h3>
      <h4>
        <!-- le slot servono per customizzare un componente passandogli un messaggio
        personalizzato dal componente padre, caso per caso-->
        <slot></slot>
      </h4>
    </div>
  </div>
</template>

<style scoped>
.success {
  color: grey;
  font-size: 10rem;
}
</style>
