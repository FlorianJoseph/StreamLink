<template>
  <div class="home-page">
    <header class="header">
      <h1>Bienvenue sur <span class="accent">StreamHub</span></h1>
      <p>Le réseau social dédié aux petits streameurs !</p>
      <button class="cta-btn">Rejoindre la communauté</button>
    </header>
    <section class="discover">
      <h2>Découvrir</h2>
      <div class="card-list">
        <div class="card">
          <h3>Streameurs à suivre</h3>
          <p>Découvre les créateurs du moment et leurs contenus.</p>
        </div>
        <div class="card">
          <h3>Partage tes streams</h3>
          <p>Publie tes lives et gagne en visibilité auprès d'autres créateurs.</p>
        </div>
        <div class="card">
          <h3>Interagis avec la communauté</h3>
          <p>Commente, aime et échange avec d'autres streameurs.</p>
        </div>
      </div>
    </section>
    <footer class="footer">
      <p>&copy; 2024 StreamHub. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script setup>
// Logique à ajouter selon besoins
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #fafbff;
}
.header {
  text-align: center;
  margin-bottom: 2rem;
}
.accent {
  color: #6c63ff;
}
.cta-btn {
  margin-top: 1rem;
  background: #6c63ff;
  color: #fff;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 24px;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108,99,255,0.12);
  transition: background 0.2s;
}
.cta-btn:hover {
  background: #5548c8;
}
.discover {
  margin-bottom: 2rem;
}
.card-list {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(108,99,255,0.08);
  padding: 1.5rem;
  min-width: 220px;
  max-width: 260px;
  flex: 1 1 220px;
  text-align: center;
}
.footer {
  text-align: center;
  margin-top: 2rem;
  color: #888;
  font-size: 0.9rem;
}
</style>