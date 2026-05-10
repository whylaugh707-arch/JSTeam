import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image, FileSearch, Info, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import exifr from "exifr";

export default function MetadataSearch() {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setMetadata(null);
    setPreview(URL.createObjectURL(file));

    try {
      const output = await exifr.parse(file);
      if (!output) {
        setMetadata({ error: "ZERO_METADATA_DETECTED: FILE_CLEANSED" });
      } else {
        setMetadata(output);
      }
    } catch (err) {
      console.error(err);
      setMetadata({ error: "PARSING_PROCEDURE_FAILED" });
    } finally {
      setLoading(false);
    }
  }, []);

  // @ts-expect-error: Dropzone types conflict
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-sans uppercase tracking-[0.3em] text-white">Forensik Digital</h2>
      </div>

      <div 
        {...getRootProps()} 
        className={`max-w-3xl mx-auto h-52 border border-cyber-border flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragActive ? "bg-cyber-red/10 border-cyber-red" : "hover:bg-cyber-red/5 hover:border-cyber-red/30"
        }`}
      >
        <input {...getInputProps()} />
        <Image className={`size-12 mb-4 transition-all duration-300 ${isDragActive ? "text-cyber-red scale-110" : "text-neutral-500"}`} />
        <p className="font-mono text-xs text-gray-400 uppercase tracking-[0.2em]">
          {isDragActive ? "LEPASKAN_UNTUK_ANALISIS_" : "UNGGAH_FILE_GAMBAR_UNTUK_PROBE_EXIF_"}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin size-10 text-cyber-red" />
        </div>
      )}

      {metadata && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          <div className="space-y-8">
            <div className="tactical-card space-y-6">
              <h3 className="flex items-center gap-3 text-white font-sans text-xl uppercase tracking-widest">
                <FileSearch className="size-5 text-cyber-red" /> PREVIEW_GAMBAR
              </h3>
              {preview && (
                <div className="aspect-video bg-black/40 border border-cyber-border overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
            </div>

            {metadata.latitude && metadata.longitude && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="tactical-card border-cyber-red/40 bg-cyber-red/5 space-y-6"
              >
                <h3 className="flex items-center gap-3 text-white font-sans text-xl uppercase tracking-widest">
                  <ShieldCheck className="size-5 text-cyber-red" /> DATA_GPS_TERDETEKSI
                </h3>
                <div className="p-6 bg-black/60 border border-cyber-border space-y-4 text-center">
                  <p className="font-mono text-lg text-white">
                    {metadata.latitude.toFixed(6)}, {metadata.longitude.toFixed(6)}
                  </p>
                  <a 
                    href={`https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tactical-btn w-full"
                  >
                    TAUTAN_KOORDINAT_SATELIT
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          <div className="tactical-card space-y-6">
            <h3 className="flex items-center gap-3 text-white font-sans text-xl uppercase tracking-widest">
              <Info className="size-5 text-cyber-red" /> LOG_EKSTRAKSI
            </h3>
            <div className="max-h-[550px] overflow-y-auto pr-2 space-y-2 font-mono text-[10px]">
              {Object.entries(metadata).length > 1 ? (
                Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-cyber-border pb-3 bg-black/20 p-3">
                    <span className="text-cyber-red/40 uppercase text-[8px] mb-1">{key}</span>
                    <span className="text-white break-all">{String(value)}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 border border-red-500/20 bg-red-500/5 p-6 space-y-4">
                  <ShieldCheck className="size-10 text-red-500 opacity-30" />
                  <span className="text-red-500 font-bold uppercase tracking-widest">{metadata.error || "TIDAK_ADA_DATA_TERDETEKSI"}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
