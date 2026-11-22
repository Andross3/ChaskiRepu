/** Reduce una foto a máx. 1024 px y la devuelve como data URL JPEG (≈ 100 KB) para enviarla a la IA. */
export async function reducirImagen(archivo: File, lado = 1024): Promise<string> {
  const bmp = await createImageBitmap(archivo);
  const k = Math.min(1, lado / Math.max(bmp.width, bmp.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.max(1, Math.round(bmp.width * k));
  lienzo.height = Math.max(1, Math.round(bmp.height * k));
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la foto.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
  bmp.close();
  return lienzo.toDataURL("image/jpeg", 0.8);
}
