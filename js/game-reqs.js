/* ゲームの公式の必要スペック（最低・推奨）。
   text: 公式ページの原文。cpu / gpu: このサイトの性能の目安（CPU: Ryzen 7 9800X3D=100、グラボ: RTX 5090=100）に置き換えた「同じくらいの性能」。
   公式が「AまたはB」と書いているときは、性能が低い方に合わせています。ram: GB、vram: GB（書かれているときだけ）。 */
window.PCR_REQS = {
 "cs2": {
  "src": "Steam ストアページ（Counter-Strike 2）",
  "url": "https://store.steampowered.com/app/730/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 10,
   "gpu": 3.5,
   "ram": 8,
   "text": {
    "cpu": "4 hardware CPU threads - Intel® Core™ i5 750 or higher",
    "gpu": "Video card must be 1 GB or more and should be a DirectX 11-compatible with support for Shader Model 5.0",
    "ram": "8 GB RAM"
   }
  },
  "rec": null
 },
 "apex": {
  "src": "Steam ストアページ（Apex Legends™）",
  "url": "https://store.steampowered.com/app/1172470/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 18,
   "gpu": 6.5,
   "ram": 6,
   "text": {
    "cpu": "AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent",
    "gpu": "AMD Radeon™ HD 7790 (2 GB), NVIDIA GeForce® GTX 950",
    "ram": "6 GB RAM"
   }
  },
  "rec": {
   "cpu": 26,
   "gpu": 11.0,
   "ram": 8,
   "text": {
    "cpu": "Ryzen 5 CPU or Equivalent",
    "gpu": "AMD Radeon™ R9 290, NVIDIA GeForce® GTX 970",
    "ram": "8 GB RAM"
   }
  }
 },
 "palworld": {
  "src": "Steam ストアページ（Palworld）",
  "url": "https://store.steampowered.com/app/1623730/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 32,
   "gpu": 15.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-9400F",
    "gpu": "GeForce GTX 1660",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 48,
   "gpu": 30.0,
   "ram": 32,
   "text": {
    "cpu": "Intel Core i5-12400 / AMD Ryzen 5 5600X",
    "gpu": "GeForce RTX 3060 Ti / Radeon RX 6700 XT",
    "ram": "32 GB RAM"
   }
  }
 },
 "ffxiv": {
  "src": "Steam ストアページ（FINAL FANTASY XIV Online）",
  "url": "https://store.steampowered.com/app/39210/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 30,
   "gpu": 11.0,
   "ram": 8,
   "text": {
    "cpu": "Intel® Core™i5-8400 or higher",
    "gpu": "NVIDIA GeForce GTX 970 or higher, AMD Radeon RX 480 or higher",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 38,
   "gpu": 20.0,
   "ram": 16,
   "text": {
    "cpu": "Intel® Core™i7-9700 or higher",
    "gpu": "NVIDIA GeForce RTX 2060 or higher, AMD Radeon RX 5600 XT or higher",
    "ram": "16 GB RAM"
   }
  }
 },
 "cyberpunk": {
  "src": "Steam ストアページ（Cyberpunk 2077）",
  "url": "https://store.steampowered.com/app/1091500/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 26,
   "gpu": 12.5,
   "ram": 12,
   "vram": 6,
   "text": {
    "cpu": "Core i7-6700 or Ryzen 5 1600",
    "gpu": "GeForce GTX 1060 6GB or Radeon RX 580 8GB or Arc A380",
    "ram": "12 GB RAM"
   }
  },
  "rec": {
   "cpu": 62,
   "gpu": 23.0,
   "ram": 16,
   "text": {
    "cpu": "Core i7-12700 or Ryzen 7 7800X3D",
    "gpu": "GeForce RTX 2060 SUPER or Radeon RX 5700 XT or Arc A770",
    "ram": "16 GB RAM"
   }
  }
 },
 "mhwilds": {
  "src": "Steam ストアページ（Monster Hunter Wilds）",
  "url": "https://store.steampowered.com/app/2246340/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 38,
   "gpu": 15.0,
   "ram": 16,
   "vram": 6,
   "text": {
    "cpu": "Intel® Core™ i5-10400 or Intel® Core™ i3-12100 or AMD Ryzen™ 5 3600",
    "gpu": "NVIDIA® GeForce® GTX 1660(VRAM 6GB) or AMD Radeon™ RX 5500 XT(VRAM 8GB)",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 38,
   "gpu": 23.0,
   "ram": 16,
   "vram": 8,
   "text": {
    "cpu": "Intel® Core™ i5-10400 or Intel® Core™ i3-12100 or AMD Ryzen™ 5 3600",
    "gpu": "NVIDIA® GeForce® RTX 2060 Super(VRAM 8GB) or　AMD Radeon™  RX 6600(VRAM 8GB)",
    "ram": "16 GB RAM"
   }
  }
 },
 "asa": {
  "src": "Steam ストアページ（ARK: Survival Ascended）",
  "url": "https://store.steampowered.com/app/2399830/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 28,
   "gpu": 19.0,
   "ram": 16,
   "text": {
    "cpu": "AMD Ryzen 5 2600X, Intel Core i7-6800K",
    "gpu": "AMD Radeon RX 5600 XT, NVIDIA GeForce 1080",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 40,
   "gpu": 37.0,
   "ram": 32,
   "text": {
    "cpu": "AMD Ryzen 5 3600X, Intel i5-10600K",
    "gpu": "AMD Radeon RX 6800, NVIDIA GeForce RTX 3080",
    "ram": "32 GB RAM"
   }
  }
 },
 "ase": {
  "src": "Steam ストアページ（ARK: Survival Evolved）",
  "url": "https://store.steampowered.com/app/346110/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 14,
   "gpu": 5.0,
   "ram": 8,
   "text": {
    "cpu": "Intel Core i5-2400/AMD FX-8320 or better",
    "gpu": "NVIDIA GTX 670 2GB/AMD Radeon HD 7870 2GB or better",
    "ram": "8 GB RAM"
   }
  },
  "rec": null
 },
 "valheim": {
  "src": "Steam ストアページ（Valheim）",
  "url": "https://store.steampowered.com/app/892970/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 12,
   "gpu": 6.5,
   "ram": 8,
   "text": {
    "cpu": "2.6 GHz Quad Core or similar",
    "gpu": "GeForce GTX 950 or Radeon HD 7970",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 20,
   "gpu": 12.5,
   "ram": 16,
   "text": {
    "cpu": "i5 3GHz or Ryzen 5 3GHz",
    "gpu": "GeForce GTX 1060 or Radeon RX 580",
    "ram": "16 GB RAM"
   }
  }
 },
 "rust": {
  "src": "Steam ストアページ（Rust）",
  "url": "https://store.steampowered.com/app/252490/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 22,
   "gpu": 10.0,
   "ram": 12,
   "text": {
    "cpu": "AMD Ryzen 5 1400 or Intel Core i5-6600",
    "gpu": "AMD Radeon RX 470, NVIDIA GeForce GTX 1060, Intel® Arc™ A580",
    "ram": "12 GB RAM"
   }
  },
  "rec": {
   "cpu": 28,
   "gpu": 25.0,
   "ram": 16,
   "text": {
    "cpu": "AMD Ryzen 7 3700X or Intel® Core i7-6700K",
    "gpu": "AMD Radeon RX 6600XT, NVIDIA GeForce RTX 3060, Intel Arc B580",
    "ram": "16 GB RAM"
   }
  }
 },
 "7dtd": {
  "src": "Steam ストアページ（7 Days to Die）",
  "url": "https://store.steampowered.com/app/251570/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 12,
   "gpu": 5.0,
   "ram": 8,
   "text": {
    "cpu": "2.8 Ghz Quad Core CPU",
    "gpu": "2 GB Dedicated Memory",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 16,
   "gpu": 8.5,
   "ram": 12,
   "text": {
    "cpu": "3.2 Ghz Quad Core CPU or faster",
    "gpu": "4 GB Dedicated Memory",
    "ram": "12 GB RAM"
   }
  }
 },
 "eldenring": {
  "src": "Steam ストアページ（ELDEN RING）",
  "url": "https://store.steampowered.com/app/1245620/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 30,
   "gpu": 11.0,
   "ram": 12,
   "text": {
    "cpu": "INTEL CORE I5-8400 or AMD RYZEN 3 3300X",
    "gpu": "NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB",
    "ram": "12 GB RAM"
   }
  },
  "rec": {
   "cpu": 36,
   "gpu": 15.0,
   "ram": 16,
   "vram": 8,
   "text": {
    "cpu": "INTEL CORE I7-8700K or AMD RYZEN 5 3600X",
    "gpu": "NVIDIA GEFORCE GTX 1070 8 GB or AMD RADEON RX VEGA 56 8 GB",
    "ram": "16 GB RAM"
   }
  }
 },
 "bg3": {
  "src": "Steam ストアページ（Baldur's Gate 3）",
  "url": "https://store.steampowered.com/app/1086940/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 20,
   "gpu": 11.0,
   "ram": 8,
   "vram": 4,
   "text": {
    "cpu": "Intel I5 4690 / AMD FX 8350 / Snapdragon X Elite",
    "gpu": "Nvidia GTX 970 / RX 480 / Intel Arc A380 / Qualcomm Adreno X1 (4GB+ of VRAM)",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 36,
   "gpu": 23.0,
   "ram": 16,
   "vram": 8,
   "text": {
    "cpu": "Intel i7 8700K / AMD r5 3600",
    "gpu": "Nvidia 2060 Super / RX 5700 XT / Intel Arc A580 (8GB+ of VRAM)",
    "ram": "16 GB RAM"
   }
  }
 },
 "wukong": {
  "src": "Steam ストアページ（Black Myth: Wukong）",
  "url": "https://store.steampowered.com/app/2358720/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 26,
   "gpu": 12.5,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-8400 / AMD Ryzen 5 1600",
    "gpu": "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 38,
   "gpu": 20.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i7-9700 / AMD Ryzen 5 5500",
    "gpu": "NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT / INTEL Arc A750",
    "ram": "16 GB RAM"
   }
  }
 },
 "ow2": {
  "src": "Steam ストアページ（Overwatch®）",
  "url": "https://store.steampowered.com/app/2357570/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 15,
   "gpu": 3.5,
   "ram": 6,
   "text": {
    "cpu": "Intel® Core™ i3 or AMD Phenom™ X3 8650",
    "gpu": "NVIDIA® GeForce® GTX 600 series, AMD Radeon™ HD 7000 series",
    "ram": "6 GB RAM"
   }
  },
  "rec": {
   "cpu": 26,
   "gpu": 12.5,
   "ram": 8,
   "text": {
    "cpu": "Intel® Core™ i7 or AMD Ryzen™ 5",
    "gpu": "NVIDIA® GeForce® GTX 1060/ GeForce® GTX 1650 or AMD R9 380/AMD RX 6400 or Intel® Arc™ A770",
    "ram": "8 GB RAM"
   }
  }
 },
 "rivals": {
  "src": "Steam ストアページ（Marvel Rivals）",
  "url": "https://store.steampowered.com/app/2767030/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 24,
   "gpu": 12.5,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-6600K or AMD Ryzen 5 1600X",
    "gpu": "NVIDIA GeForce GTX 1060 / AMD RX 580 / Intel Arc A380",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 38,
   "gpu": 20.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-10400 or AMD Ryzen 5 5600X",
    "gpu": "NVIDIA GeForce RTX 2060 (Super) / AMD RX 5700-XT / Intel Arc A750",
    "ram": "16 GB RAM"
   }
  }
 },
 "bf6": {
  "src": "Steam ストアページ（Battlefield™ 6）",
  "url": "https://store.steampowered.com/app/2807960/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 30,
   "gpu": 20.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-8400, AMD Ryzen 5 2600",
    "gpu": "Nvidia RTX 2060, AMD Radeon RX 5600 XT 6GB, Intel Arc A380",
    "ram": "16 GB RAM"
   }
  },
  "rec": {
   "cpu": 42,
   "gpu": 30.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i7-10700, AMD Ryzen 7 3700X",
    "gpu": "Nvidia RTX 3060Ti, AMD Radeon RX 6700-XT, Intel Arc B580",
    "ram": "16 GB RAM"
   }
  }
 },
 "warzone": {
  "src": "Steam ストアページ（Call of Duty®: Warzone™）",
  "url": "https://store.steampowered.com/app/1962663/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 18,
   "gpu": 8.5,
   "ram": 8,
   "text": {
    "cpu": "Intel® Core™ i3-6100 / Core™ i5-2500K or AMD Ryzen™ 3 1200",
    "gpu": "NVIDIA® GeForce® GTX 960 or AMD Radeon™ RX 470 - DirectX 12.0 compatible system",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 24,
   "gpu": 12.5,
   "ram": 12,
   "text": {
    "cpu": "Intel® Core™ i5-6600K / Core™ i7-4770 or AMD Ryzen™ 5 1400",
    "gpu": "NVIDIA® GeForce® GTX 1060 or AMD Radeon™ RX 580 - DirectX 12.0 compatible system",
    "ram": "12 GB RAM"
   }
  }
 },
 "pubg": {
  "src": "Steam ストアページ（PUBG: BATTLEGROUNDS）",
  "url": "https://store.steampowered.com/app/578080/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 16,
   "gpu": 8.5,
   "ram": 8,
   "text": {
    "cpu": "Intel Core i5-4430 / AMD FX-6300",
    "gpu": "NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 24,
   "gpu": 11.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i5-6600K / AMD Ryzen 5 1600",
    "gpu": "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB",
    "ram": "16 GB RAM"
   }
  }
 },
 "helldivers": {
  "src": "Steam ストアページ（HELLDIVERS™ 2）",
  "url": "https://store.steampowered.com/app/553850/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 23,
   "gpu": 6.5,
   "ram": 8,
   "text": {
    "cpu": "Intel Core i7-4790K or AMD Ryzen 5 1500X",
    "gpu": "NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 470",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 38,
   "gpu": 20.0,
   "ram": 16,
   "text": {
    "cpu": "Intel Core i7-9700K or AMD Ryzen 7 3700X",
    "gpu": "NVIDIA GeForce RTX 2060 or AMD Radeon RX 6600XT",
    "ram": "16 GB RAM"
   }
  }
 },
 "gtav": {
  "src": "Steam ストアページ（Grand Theft Auto V Legacy）",
  "url": "https://store.steampowered.com/app/271590/",
  "checked": "2026-11-19",
  "min": {
   "cpu": 6,
   "gpu": 1.5,
   "ram": 4,
   "text": {
    "cpu": "Intel Core 2 Quad CPU Q6600 @ 2.40GHz (4 CPUs) / AMD Phenom 9850 Quad-Core Processor (4 CPUs) @ 2.5GHz",
    "gpu": "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)",
    "ram": "4 GB RAM"
   }
  },
  "rec": {
   "cpu": 14,
   "gpu": 5.0,
   "ram": 8,
   "text": {
    "cpu": "Intel Core i5 3470 @ 3.2GHz (4 CPUs) / AMD X8 FX-8350 @ 4GHz (8 CPUs)",
    "gpu": "NVIDIA GTX 660 2GB / AMD HD 7870 2GB",
    "ram": "8 GB RAM"
   }
  }
 },
 "valorant": {
  "src": "Riot Games 公式サポート（内容は検索で確認）",
  "url": "https://support-valorant.riotgames.com/hc/articles/360044136134",
  "checked": "2026-11-19",
  "note": "公式の最新の推奨スペック（60fps以上）は確認できなかったため、最低スペックだけ載せています。",
  "min": {
   "cpu": 8,
   "gpu": 1.5,
   "ram": 4,
   "text": {
    "cpu": "Intel Core i3-540 / AMD Athlon 200GE",
    "gpu": "Intel HD 4000 / AMD Radeon R5 220（VRAM 1GB）",
    "ram": "4 GB RAM"
   }
  },
  "rec": null
 },
 "fortnite": {
  "src": "Epic Games 公式ヘルプ（内容は検索で確認）",
  "url": "https://www.epicgames.com/help/en-US/c-202300000001636/a202300000012731",
  "checked": "2026-11-19",
  "min": {
   "cpu": 12,
   "gpu": 1.5,
   "ram": 8,
   "text": {
    "cpu": "Core i3-3225 3.3 GHz",
    "gpu": "Intel HD 4000 / AMD Radeon Vega 8",
    "ram": "8 GB RAM"
   }
  },
  "rec": {
   "cpu": 16,
   "gpu": 8.5,
   "ram": 16,
   "vram": 2,
   "text": {
    "cpu": "Core i5-7300U 3.5 GHz / AMD Ryzen 3 3300U 相当",
    "gpu": "NVIDIA GTX 960 / AMD R9 280 相当（VRAM 2GB）",
    "ram": "16 GB RAM（NVMe SSD 推奨）"
   }
  }
 },
 "minecraft": {
  "src": "Minecraft 公式（minecraft.net、内容は検索で確認）",
  "url": "https://www.minecraft.net/ja-jp/article/minecraft-java-edition-system-requirements",
  "checked": "2026-11-19",
  "note": "Java版の新しい必要スペック（Vulkan 1.3対応のグラボが必要）。CPU・グラボの型番は公式に示されていないため、目安です。",
  "min": {
   "cpu": 14,
   "gpu": 6.5,
   "ram": 8,
   "vram": 2,
   "text": {
    "cpu": "4コアのCPU",
    "gpu": "Vulkan 1.3 対応（VRAM 2GB以上）",
    "ram": "8 GB RAM（内蔵グラフィックスなら12GB）"
   }
  },
  "rec": {
   "cpu": 26,
   "gpu": 15.0,
   "ram": 16,
   "vram": 6,
   "text": {
    "cpu": "（型番の指定なし）",
    "gpu": "VRAM 6GB以上",
    "ram": "16 GB RAM（1080p・60fps・Fancy）"
   }
  }
 },
 "lol": {
  "src": "Riot Games 公式サポート（内容は検索で確認）",
  "url": "https://support-leagueoflegends.riotgames.com/hc/articles/201752654",
  "checked": "2026-11-19",
  "note": "公式ページの数値は古い発表と同じ可能性があります。",
  "min": {
   "cpu": 6,
   "gpu": 1.5,
   "ram": 2,
   "text": {
    "cpu": "Intel Core i3-530 / AMD A6-3650",
    "gpu": "DirectX 11（機能レベル11_0）対応",
    "ram": "2 GB RAM"
   }
  },
  "rec": {
   "cpu": 16,
   "gpu": 3.5,
   "ram": 4,
   "text": {
    "cpu": "Intel Core i5-3300 / AMD Ryzen 3 1200",
    "gpu": "DirectX 11 対応（GTX 560 相当）",
    "ram": "4 GB RAM"
   }
  }
 }
};
