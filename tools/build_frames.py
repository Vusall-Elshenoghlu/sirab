"""4 videonu bir-birinə piksel dəqiqliyi ilə tikilmiş kadr ardıcıllığına çevirir."""
import cv2, numpy as np, os, sys, json
from PIL import Image

SRC = sys.argv[1]; OUT = sys.argv[2]
ids = ['59502', '59503', '59504', '59505']
files = {i: os.path.join(SRC, [f for f in os.listdir(SRC) if i in f and f.endswith('.mp4')][0]) for i in ids}
FPS = 24
RAMP = 18  # keçid düzəlişinin söndüyü kadr sayı
sift = cv2.SIFT_create(4000)

def read(path):
    cap = cv2.VideoCapture(path); fps = cap.get(cv2.CAP_PROP_FPS); fr = []
    while True:
        ok, f = cap.read()
        if not ok: break
        fr.append(f)
    if abs(fps - FPS) > 0.5:
        n = int((len(fr) - 1) * FPS / fps) + 1
        idx = np.linspace(0, len(fr) - 1, n).round().astype(int)
        fr = [fr[i] for i in idx]
    return fr

def align(A, B):
    """B-ni A koordinatlarına aparan oxşarlıq transformu (B → A)."""
    g1 = cv2.cvtColor(A, cv2.COLOR_BGR2GRAY); g2 = cv2.cvtColor(B, cv2.COLOR_BGR2GRAY)
    k1, d1 = sift.detectAndCompute(g1, None); k2, d2 = sift.detectAndCompute(g2, None)
    m = cv2.BFMatcher().knnMatch(d2, d1, k=2)
    good = [a for a, b in m if a.distance < 0.75 * b.distance]
    src = np.float32([k2[g.queryIdx].pt for g in good]); dst = np.float32([k1[g.trainIdx].pt for g in good])
    M, _ = cv2.estimateAffinePartial2D(src, dst, ransacReprojThreshold=3)
    return M

def sharpen(img, a=0.38):
    b = cv2.GaussianBlur(img, (0, 0), 1.1)
    return cv2.addWeighted(img, 1 + a, b, -a, 0)

vids = [read(files[i]) for i in ids]
for i, v in zip(ids, vids): print(i, len(v), v[0].shape)

# Kvadrat videoları 960x960-a gətir (59504 = 960x958)
for k in range(3):
    vids[k] = [cv2.resize(f, (960, 960), interpolation=cv2.INTER_CUBIC) if f.shape[:2] != (960, 960) else f for f in vids[k]]

seq = []  # (frame, kind) kind: 'sq' | 'wide'
meta = {'fps': FPS, 'chapters': []}
seq += [(f, 'sq') for f in vids[0]]
meta['chapters'].append([0, len(seq) - 1])

for k in (1, 2):
    prev_last = seq[-1][0]; nxt = vids[k]
    M = align(prev_last, nxt[0])
    warped0 = cv2.warpAffine(nxt[0], M, (960, 960), borderMode=cv2.BORDER_REFLECT)
    gain = (prev_last.reshape(-1, 3).mean(0) + 1e-3) / (warped0.reshape(-1, 3).mean(0) + 1e-3)
    print('seam', k, 'scale', np.hypot(M[0, 0], M[1, 0]).round(4), 't', M[:, 2].round(2), 'gain', gain.round(3))
    start = len(seq)
    for j, f in enumerate(nxt[1:], start=1):
        w = max(0.0, 1 - j / RAMP)
        if w > 0:
            I = np.float32([[1, 0, 0], [0, 1, 0]])
            Mj = I + (M - I) * w
            f = cv2.warpAffine(f, Mj, (960, 960), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
            g = 1 + (gain - 1) * w
            f = np.clip(f.astype(np.float32) * g, 0, 255).astype(np.uint8)
        seq.append((f, 'sq'))
    meta['chapters'].append([start, len(seq) - 1])

# 4-cü video: 1280x720, kvadrat videolar onun mərkəzi hissəsidir (miqyas ~1.33)
prev_last = seq[-1][0]; nxt = vids[3]
M = align(prev_last, nxt[0])
s = float(np.hypot(M[0, 0], M[1, 0])); tx, ty = float(M[0, 2]), float(M[1, 2])
print('seam 3 scale', round(s, 4), 'tx', round(tx, 2), 'ty', round(ty, 2))
# Geniş kadrı "kvadrat koordinatlarında" saxla: genişlik 1280*s, kvadrat x=-tx.. -tx+960
W4 = int(round(1280 * s)); H4 = int(round(720 * s))
meta['wide'] = {'scale': s, 'squareX': -tx, 'squareY': -ty, 'w': W4, 'h': H4}
# rəng düzəlişi: kvadrat hissədə müqayisə
w0 = cv2.warpAffine(nxt[0], M, (960, 960))
gain = (prev_last[40:-40, 40:-40].reshape(-1, 3).mean(0) + 1e-3) / (w0[40:-40, 40:-40].reshape(-1, 3).mean(0) + 1e-3)
print('seam 3 gain', gain.round(3))
start = len(seq)
for j, f in enumerate(nxt[1:], start=1):
    w = max(0.0, 1 - j / RAMP)
    if w > 0:
        f = np.clip(f.astype(np.float32) * (1 + (gain - 1) * w), 0, 255).astype(np.uint8)
    seq.append((f, 'wide'))
meta['chapters'].append([start, len(seq) - 1])
meta['count'] = len(seq)
meta['wideStart'] = start

for d in ('d', 'm'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
for n, (f, kind) in enumerate(seq):
    rgb = cv2.cvtColor(sharpen(f), cv2.COLOR_BGR2RGB)
    im = Image.fromarray(rgb)
    im.save(os.path.join(OUT, 'd', f'{n+1:04d}.webp'), 'WEBP', quality=86, method=5)
    sm = im.resize((round(im.width * 0.6), round(im.height * 0.6)), Image.LANCZOS)
    sm.save(os.path.join(OUT, 'm', f'{n+1:04d}.webp'), 'WEBP', quality=80, method=5)
json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
print(json.dumps(meta))
