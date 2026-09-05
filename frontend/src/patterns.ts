/// A pattern is a set of live-cell offsets relative to its top-left corner.
export type Pattern = { name: string; width: number; height: number; cells: [number, number][] };

/// Parse a Conway RLE string into a set of live-cell offsets.
///
/// RLE format (see the LifeWiki): a header line `x = w, y = h, rule = ...`
/// followed by rows where each token is `[count]<char>`. `b` = dead, `o` = live,
/// `$` = end of row, `!` = end of pattern. Missing trailing cells are dead, and
/// a count of 1 may be omitted. Coordinates are stored relative to the top-left.
export function parseRLE(rle: string): { width: number; height: number; cells: [number, number][] } {
    // Header(s): lines starting with `x =`, `#`, or whitespace are stripped.
    const headerLines: string[] = [];
    const lines = rle.split(/\r?\n/);
    let body = "";
    let firstBodyLine = 0;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith("x =")) {
            headerLines.push(trimmed);
            firstBodyLine = i + 1;
        } else {
            break;
        }
    }
    body = lines.slice(firstBodyLine).join("");

    // Extract the declared dimensions from the header for validation/fallback.
    let declaredW = 0;
    let declaredH = 0;
    for (const line of headerLines) {
        if (!line.startsWith("x =")) continue;
        const wm = line.match(/x\s*=\s*(\d+)/);
        const hm = line.match(/y\s*=\s*(\d+)/);
        if (wm) declaredW = Number(wm[1]);
        if (hm) declaredH = Number(hm[1]);
    }

    const cells: [number, number][] = [];
    let x = 0;
    let y = 0;
    let width = 0;
    let count = 0;

    let i = 0;
    while (i < body.length) {
        const ch = body[i];
        if (ch >= "0" && ch <= "9") {
            count = count * 10 + (ch.charCodeAt(0) - "0".charCodeAt(0));
            i++;
            continue;
        }
        const n = count === 0 ? 1 : count;
        count = 0;
        if (ch === "b") {
            x += n;
        } else if (ch === "o") {
            for (let k = 0; k < n; k++) {
                cells.push([x + k, y]);
            }
            x += n;
        } else if (ch === "$") {
            y += n;
            x = 0;
        } else if (ch === "!") {
            break;
        } else {
            break; // ignore unknown characters
        }
        if (x > width) width = x;
        i++;
    }

    let height = y;
    for (const [, cy] of cells) {
        if (cy + 1 > height) height = cy + 1;
    }
    if (declaredW > width) width = declaredW;
    if (declaredH > height) height = declaredH;

    return { width, height, cells };
}

/// A single glider moving southeast.
const GLIDER_RLE = "x = 3, y = 3, rule = B3/S23\nbob$2bo$3o!";

/// Gosper's period-30 glider gun: emits a glider every 30 generations.
const GLIDER_GUN_RLE = "x = 36, y = 9, rule = B3/S23\n24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!";

/// The original puffer train from Gosper's paper: a B-heptomino escorted by
/// two LWSS, leaving debris as it travels.
const PUFFER_TRAIN_RLE = "x = 5, y = 18, rule = B3/S23\n3bo$4bo$o3bo$b4o4$o$boo$bbo$bbo$bo3$3bo$4bo$o3bo$b4o!";

/// Quartermax: a spacefiller by Keith Amling (2022), with reductions by
/// Hartmut Holzwart and "iNoMed". The fastest-growing known pattern type —
/// it fills a quarter of the plane with the stripes agar, expanding the
/// bounding box enormously. An ideal HashLife stress test.
const QUARTERMAX_RLE =
    "x = 108, y = 60, rule = B3/S23\n" +
    "2bo$b3o5b3o12bo5bo$2obo4bo2bo5b3o3b3o3b3o$3o4b3obo4bo2bo3bob2ob2obo$3o2bo6bo3bo2" +
    "bo4b3ob3o$b2o5bo4bo4b4o2b3o2b2o$7bo6bobobob2o2b3o$14bobob2o2bo2b2o39b3o$12b2o3bo" +
    "2b2o2b3o5b3o24b3o4bo2bo$15b2o4b3o3b2o2bo2bo7b3o3b3o7bo2bo4bo$12b5o2b2o8bo5bo5bo2" +
    "bo2bo2bo10bo4bo$12bo6b2obo5b3o2b2o6bo3bo4bo6bo3bo5bobo$11b2o5b2o5b2o3b2ob6ob2obo" +
    "7bo4bo4bo$12bo2b4obo2bob2o2b4o2bo2b2o2bo4bo2b2o2b2obo3bob2o6b3o$13bo3bo6b2o5bo5b" +
    "2o2bob2o2bo2b2o2b2obo3b2o2bo4bo2bo$13b2o2bo9bob2o6b5ob3o2bo4b2o2bo4bo10bo$8bo3b2" +
    "ob2o19bob2o2bobo2bo8bo2b4o2bo7bo$7b3o4bo20bo5bo2b2ob2o2b2o5b2o3b2ob3obobo$7bob2o" +
    "25bo2b2o4b2o4bo6bo2b2o4b2o$8b3o23b2o3bo2bob2obo2bo4bo4bo32bobo$8b6o20b4obobo5bob" +
    "2o4b3o7b2o2bo23bo2bo$8b3obob2o14bo6bobo3bobobo9bo6bo25bo5b2o$11bo4bo12b3o3b3obo2" +
    "bo4b2ob2o5b6o6bo19b3o2bo3bo$10bo18bob2o4b3o4bo3b5ob3o2bobo2bob3o3b3o3b3o7b2obo3b" +
    "ob3o$10bo4b2o15bo4b3o3b2o4b2o2b2obo4b2o9bo2bobo2bo7b3o10b2o$10bo17b3o3bobobo3b3o" +
    "14bob2o8bo3bobo4bo6b2o4b5o3bo$10bo17b4o3bo6b2o10bobo2bob2o5b6obobob4o17bo3bo$10b" +
    "o18bo8bo14bo6b3o5bo6bobobo3b2ob2o9b2o5bo$11bobo22b2o22b3o3bob9ob6obobo5bob4o3bob" +
    "o$35bo2bo22b2o4bo17bo3bo2bob2o6b2o$31b3ob4o29b17ob4o2b2o7b2o$30b2ob6o52b2o6bob2o" +
    "2bo$29b2o37b24o7bob2o$29b2o33b2obo36bob2o$29b2o3bo3bo26bob27o9bo3bo$32b2o30bo28b" +
    "2o8bo3bo$29bo33bob2ob4o2b4o2b4o2b3obobob2o7bo2bo$29b2ob3o28bobo2b2o2bob2o2bob2o2" +
    "bob2o4bob3o7bo$28bo4bobo24b2obob2o3bo5bo5bo5bo5b2o$27bobo5b2o23bo2bo26bo3bo$34b2" +
    "o26bo4bo25bo$28b2o4b2ob2o22b2obobo4bo16bo3bo$27b2ob2o31bobo3b2obo14b2o3b6o$27b5o" +
    "4bo26bob3o4bo14b2o3bob5o$28b3o31b2obo2bo3bob2o10b2o6b3ob2o$29bo31bo2bobo4b2o2bo8" +
    "b3o3b2o5b2o$29b2o30b2obo2bo2bo2b2o8bobob4o$30bo3bo29bo2b2o2bo6b2o3bo2b2o3bo$33b3" +
    "o28bob2ob2o6b6o6bob2o$33bob2o26b2o2bobo7b4obob5ob2obo$34b3o25bo2b3obobo12bo4b2o2" +
    "bo$34b3o25b2o4b2ob3o7b3o3bo4b2o$34b2o28b2o2bobo3bo12bo$64bob2o2bob2o16b2o$65b2ob" +
    "obobo$68bobobo$63b3o3bobo$63bo2bob2o$64bobobobo$65bo3b2o!";

/// Acorn: the most vigorously growing 7-cell methuselah, found by Charles
/// Corderman. Tiny and bounded but erupts into generations of messy,
/// seemingly-random chaos before settling into stable debris.
const ACORN_RLE = "x = 7, y = 3, rule = B3/S23\nbob$3bob$2o2b3o!";

/// R-pentomino: the most famous small methuselah. Five cells that take 1103
/// generations to settle, throwing off multiple gliders as it does.
const R_PENTOMINO_RLE = "x = 3, y = 3, rule = B3/S23\nb2o$2ob$bob!";

/// Switch-engine breeder (Helmut Postl, 1997). A puffer train that lays down
/// a new block-laying switch engine every 80 generations. Grows quadratically
/// — forever — but stays sparse, filling half a quadrant with a grid of blocks
/// and switch engines. A self-replicating machine: Conway's Life in miniature.
const SWITCH_ENGINE_BREEDER_RLE =
    "x = 85, y = 164, rule = B3/S23\n" +
    "58boo5b4o$56booboo3bo3bo$56b4o8bo$57boo5bobbo$$52boo9bo$50b5o8b3o$50boo4bo5bo3bo" +
    "$50boo5b5o4bo$52boo4b4oboboo$55b3oboo3bo$61bobo$24boo$22booboo14bo$22b4o13boo24b" +
    "4o$23boo15boo22bo3bo$18bo28b4o17bo$11boo6boo25bo3bo13bobbo$7b4oboo12bo23bo$7b6o1" +
    "1boo20bobbo9boo$8b4o13boobboo24b4oboo$29bobo23b6o$29bo26b4o5b4o$11bo52bo3bo$9boo" +
    "30boo25bo$10boo29bobo11bobo9bo$41bo22boo$54boo$54boo6boo3boo$54bo7bob3oboo$54boo" +
    "7b6o$64b4o3$54b6o$53bo5bo$59bo$6bo46bo4bo$4bobo48boo$5boo4$58boo$49b4o4b4o$48bo3" +
    "bo4booboo$52bo6boo$48bobbo3$56boo$56bobo$56boboo$57boo$57bo$$15b4o$14bo3bo39boo$" +
    "18bo38b4o$14bobbo22boo15booboo$39b4o16boo$39booboo$41boo$48b6o$47bo5bo$53bo4boo$" +
    "47bo4bo4b4o$49boo6booboo$59boo$17boo$16b4o32bo$16booboo30b6o$18boo30bo3b8o$51boo" +
    "8bo$52b3o6bo$53boo5bo$57boo$47b4o$46b6o$46b4oboo$50boo5$26boo$24booboo$24b4o$25b" +
    "oo3$70b4o$69b6o$69b4oboo$73boo$27bo$27boo$26bobo$79b6o$75b4o5bo$63bobo9boobo5bo$" +
    "63boo10boobbo3bo$64bo16bo$81boo$80b4o$80booboo$82boo$71b6o$70bo5bo$63boo11bo$62b" +
    "4o4bo4bo$62booboo5boo7boo$64boo14b4o$80booboo$38b4o17boo21boo$37bo3bo16boo$41bo$" +
    "37bobbo16boo$79boo$73b3o3bobo$70b3o6boboo$70bo9boo$70b3o7bo3$48b4o29boo$47b6o19b" +
    "4o4b4o$47b4oboo17bo3bo4booboo$51boo22bo6boo$71bobbo$$53bo$8bo42bo3bob6o$8boo40b3" +
    "o3bo5bo$7bobo40bo5bo5bo$38bobo9boboo3bo3bo$38boo11b3o5bo$39bo19boo$58b4o$26bobo2" +
    "9booboo$26boo32boo$27bo21b6o$48bo5bo$b6o34boo11bo$o5bo33b4o4bo4bo$6bo33booboo5bo" +
    "o7boo$o4bo25boo9boo14b4o$bboo27bobo24booboo$16b4o11bo28boo$15bo3bo$19bo$15bobbo2" +
    "9boo$47bobbo$42b3o13boo$41bobbo8bo5boo$41booboo3bo3bo4boo$49bo4bo3bo$51bo$$59boo" +
    "$50b4o4b4o$49bo3bo4booboo$53bo6boo$49bobbo!";

function toPattern(name: string, rle: string): Pattern {
    const p = parseRLE(rle);
    return { name, width: p.width, height: p.height, cells: p.cells };
}

/// Predefined patterns offered in the sidebar.
export const PRESET_PATTERNS: Pattern[] = [
    toPattern("Glider", GLIDER_RLE),
    toPattern("Glider gun", GLIDER_GUN_RLE),
    toPattern("Puffer train", PUFFER_TRAIN_RLE),
    toPattern("Quartermax", QUARTERMAX_RLE),
    toPattern("Switch engine breeder", SWITCH_ENGINE_BREEDER_RLE),
    toPattern("Acorn", ACORN_RLE),
    toPattern("R-pentomino", R_PENTOMINO_RLE),
];