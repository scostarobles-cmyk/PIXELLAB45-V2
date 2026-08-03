// ===============================
// EDITOR.JS CARGADO
// ===============================

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "editor.js cargado correctamente",
    "monitorEditor"
);
// =====================================================
// INICIO EDITOR
// =====================================================

async function iniciarEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor",
        "Iniciando editor...",
        "monitorEditor"
    );


    await generarBibliotecaEditor();


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Editor",
        "Editor iniciado correctamente",
        "monitorEditor"
    );

}
async function generarBibliotecaEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Generando biblioteca...",
        "monitorEditor"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Biblioteca",
        "Biblioteca generada correctamente",
        "monitorEditor"
    );

}