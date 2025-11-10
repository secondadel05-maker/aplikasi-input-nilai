import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const btnSimpan = document.getElementById("btnSimpan");
const btnTampilkan = document.getElementById("btnTampilkan");

// Alert Helper
function showAlert(message, type = "success") {
  const alertPlaceholder = document.getElementById("alertPlaceholder");
  if (!alertPlaceholder) return;
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// Validasi Input
function validasiInput(nama, nim, kodeMk, nilai) {
  if (!nama || !nim || !kodeMk || !nilai) {
    showAlert("Semua field wajib diisi!", "danger");
    return false;
  }
  if (isNaN(nilai) || nilai < 0 || nilai > 100) {
    showAlert("Nilai harus angka antara 0 - 100!", "warning");
    return false;
  }
  return true;
}

// Simpan Data (Create)
async function simpanData() {
  const nama = document.getElementById("nama").value.trim();
  const nim = document.getElementById("nim").value.trim();
  const kodeMk = document.getElementById("kode_mk").value;
  const nilai = parseFloat(document.getElementById("nilai").value);
  const [kode_mk, nama_mk] = kodeMk.split("|");

  if (!validasiInput(nama, nim, kodeMk, nilai)) return;

  try {
    await addDoc(collection(db, "nilai_mahasiswa"), {
      nama, nim, kode_mk, nama_mk, nilai, waktu_simpan: new Date()
    });
    showAlert("✅ Data berhasil disimpan!");
    document.getElementById("formNilai").reset();
  } catch (error) {
    console.error("Gagal simpan:", error);
    showAlert("❌ Gagal menyimpan data!", "danger");
  }
}

// Hapus Data (Delete)
async function hapusData(id) {
  if (!confirm("Yakin ingin menghapus data ini?")) return;
  try {
    await deleteDoc(doc(db, "nilai_mahasiswa", id));
    showAlert("🗑️ Data berhasil dihapus!");
    loadData();
  } catch (error) {
    console.error("Gagal hapus:", error);
    showAlert("❌ Gagal menghapus data!", "danger");
  }
}

// Edit Data (Update)
async function editData(id, oldData) {
  const newNama = prompt("Nama:", oldData.nama);
  const newNim = prompt("NIM:", oldData.nim);
  const newNilai = parseFloat(prompt("Nilai:", oldData.nilai));

  if (!newNama || !newNim || isNaN(newNilai)) {
    alert("Perubahan dibatalkan karena input tidak valid.");
    return;
  }

  try {
    await updateDoc(doc(db, "nilai_mahasiswa", id), {
      nama: newNama,
      nim: newNim,
      nilai: newNilai
    });
    showAlert("✏️ Data berhasil diperbarui!");
    loadData();
  } catch (error) {
    console.error("Gagal update:", error);
    showAlert("❌ Gagal memperbarui data!", "danger");
  }
}

// Load Data (Read)
async function loadData() {
  const tbody = document.getElementById("tbodyNilai");
  if (!tbody) return;

  try {
    const q = query(collection(db, "nilai_mahasiswa"), orderBy("waktu_simpan", "desc"));
    const snapshot = await getDocs(q);

    tbody.innerHTML = "";
    let no = 1;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      tbody.innerHTML += `
        <tr>
          <td>${no++}</td>
          <td>${data.nama}</td>
          <td>${data.nim}</td>
          <td>${data.nama_mk}</td>
          <td>${data.nilai}</td>
          <td>
            <button class="btn btn-warning btn-sm" data-id="${docSnap.id}" data-action="edit">Edit</button>
            <button class="btn btn-danger btn-sm" data-id="${docSnap.id}" data-action="delete">Hapus</button>
          </td>
        </tr>`;
    });

    // Event Listener dinamis
    tbody.querySelectorAll("button").forEach((btn) => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const row = btn.closest("tr");
      const data = {
        nama: row.children[1].innerText,
        nim: row.children[2].innerText,
        nama_mk: row.children[3].innerText,
        nilai: parseFloat(row.children[4].innerText)
      };
      if (action === "delete") btn.addEventListener("click", () => hapusData(id));
      if (action === "edit") btn.addEventListener("click", () => editData(id, data));
    });

  } catch (error) {
    console.error("Gagal load:", error);
    showAlert("❌ Gagal memuat data!", "danger");
  }
}

// Event Handler
if (btnSimpan) btnSimpan.addEventListener("click", simpanData);
if (btnTampilkan) btnTampilkan.addEventListener("click", () => {
  window.location.href = "lihat-data.html";
});

document.addEventListener("DOMContentLoaded", loadData);
