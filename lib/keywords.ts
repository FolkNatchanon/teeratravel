export const PACKAGE_KEYWORDS = [
    { id: "RELAX", label: "พักผ่อน/ชิล" },
    { id: "ADVENTURE", label: "ผจญภัย/กีฬา" },
    { id: "PARTY", label: "ปาร์ตี้/ไนท์ไลฟ์" },
    { id: "CULTURE", label: "วัฒนธรรม/ประวัติศาสตร์" },
    { id: "ROMANTIC", label: "โรแมนติก/คู่รัก" },
    { id: "FAMILY", label: "ครอบครัว/เด็ก" },
] as const;

export type PackageKeyword = typeof PACKAGE_KEYWORDS[number]['id'];
