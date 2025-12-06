import * as d3 from "d3";

export default function calcWords(props) {
  let {
    data,
    maxFontSize,
    minFontSize,
    streamSizeScale,
    screenDimensions,
    stackedLayers,
    dates,
    boxes,
    boxWidth,
    fields,
  } = props;
  let fontSizeScale = generateFontSizeScale(),
    cw = 1 << 14,
    ch = 1 << 11,
    font = "Arial",
    cloudRadians = Math.PI / 180,
    spiral = achemedeanSpiral;
  getImageData();

  for (let tc = 0; tc < fields.length; tc++) {
    const field = fields[tc];
    const board = buildBoard(boxes, field);
    // const innerBoxes = boxes[field];
    //Place
    for (let bc = 0; bc < data.length; bc++) {
      const words = data[bc].words[field];
      const n = words.length;
      const innerBox = boxes[field][bc];
      board.boxWidth = innerBox.width;
      board.boxHeight = innerBox.height;
      board.boxX = innerBox.x;
      board.boxY = innerBox.y;
      for (let i = 0; i < n; i++) {
        place(words[i], board, bc);
      }
    }
  }

  function generateFontSizeScale() {
    let max = 0,
      min = Math.pow(10, 1000);
    data.forEach((box) => {
      fields.forEach((field) => {
        let i = 0,
          j = Math.pow(10, 1000);
        box.words[field].forEach((word) => {
          if (word.sudden > i) i = word.sudden;
          if (word.sudden < j) j = word.sudden;
        });
        if (i > max) max = i;
        if (j < min) min = j;
      });
    });
    return d3
      .scaleLinear()
      .domain([min, max])
      .range([minFontSize, maxFontSize])
      .nice();
  }

  function getImageData() {
    const av = 0;
    const flow = 0;
    // const data = boxes.data;
    const c = getContext(document.createElement("canvas"));
    c.clearRect(0, 0, cw, ch);
    let x = 0,
      y = 0,
      maxh = 0;
    for (let i = 0; i < data.length; i++) {
      for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        const field = fields[fieldIndex];
        const words = data[i].words[field];
        const n = words.length;
        let di = -1;
        let d = {};
        while (++di < n) {
          d = words[di];
          c.save();
          d.fontSize = fontSizeScale(d.sudden);
          d.rotate = (~~(Math.random() * 4) - 2) * av - flow;
          c.font = ~~(d.fontSize + 1) + "px " + font;
          const w = ~~c.measureText(d.text).width,
            h = d.fontSize;
          if (h > maxh) maxh = h;
          if (x + w >= cw) {
            x = 0;
            y += maxh;
            maxh = 0;
          }
          if (y + h >= ch) break;
          c.translate(x + (w >> 1), y + (h >> 1));
          if (d.rotate) c.rotate(d.rotate * cloudRadians);
          c.fillText(d.text, 0, 0);
          if (d.padding) {
            c.lineWidth = (2 * d.padding, c.strokeText(d.text, 0, 0));
          }
          c.restore();

          d.width = w;
          d.height = h;
          d.x = x;
          d.y = y;
          d.x1 = w >> 1;
          d.y1 = h >> 1;
          d.x0 = -d.x1;
          d.y0 = -d.y1;
          d.timeStep = i;
          d.streamHeight = streamSizeScale(d.frequency);
          x += w;
        }
      }
    }

    for (let bc = 0; bc < data.length; bc++) {
      for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        const field = fields[fieldIndex];
        const words2 = data[bc].words[field];
        const n2 = words2.length;
        let di2 = -1;
        let d2 = {};
        while (++di2 < n2) {
          d2 = words2[di2];
          const pixels = c.getImageData(d2.x, d2.y, d2.width, d2.height).data;
          d2.sprite = [];
          for (let i2 = 0; i2 << 2 < pixels.length; i2++) {
            d2.sprite.push(pixels[i2 << 2]);
          }
        }
      }
    }
  }

  function getContext(canvas) {
    canvas.width = cw;
    canvas.height = ch;
    const context = canvas.getContext("2d");
    context.fillStyle = context.strokeStyle = "red";
    context.textAlign = "center";
    context.textBaseline = "middle";
    return context;
  }

  function buildSvg(field) {
    const width = screenDimensions[0],
      height = screenDimensions[1];
    const svg = d3.select(document.createElement("svg"));
    svg.attr("width", width).attr("height", height);
    const graphGroup = svg.append("g");

    const catIndex = fields.indexOf(field);

    const area1 = d3
      .area()
      .curve(d3.curveLinear)
      .x(function (d, i) {
        return i * boxWidth;
      })
      .y0(0)
      .y1(function (d) {
        return streamSizeScale(d[0]);
      });

    const area2 = d3
      .area()
      .curve(d3.curveLinear)
      .x(function (d, i) {
        return i * boxWidth;
      })
      .y0(function (d) {
        return streamSizeScale(d[1]);
      })
      .y1(height);
    graphGroup
      .append("path")
      .datum(stackedLayers[catIndex])
      .attr("d", area1)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("fill", "red")
      .attr("id", "path1");
    graphGroup
      .append("path")
      .datum(stackedLayers[catIndex])
      .attr("d", area2)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("fill", "red")
      .attr("id", "path2");
    return svg;
  }

  function buildCanvas(boxes, field) {
    const svg = buildSvg(field);
    const path1 = svg.select("#path1").attr("d");
    const p2d1 = new Path2D(path1);
    const path2 = svg.select("#path2").attr("d");
    const p2d2 = new Path2D(path2);
    const canvas = document.createElement("canvas");
    // document.querySelector('body').appendChild(canvas);
    canvas.width = screenDimensions[0];
    canvas.height = screenDimensions[1];
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fill(p2d1);
    ctx.fill(p2d2);
    return canvas;
  }

  function buildBoard(boxes, field) {
    const canvas = buildCanvas(boxes, field);
    const width = canvas.width,
      height = canvas.height;
    const board = {};
    board.x = 0;
    board.y = 0;
    board.width = width;
    board.height = height;
    const sprite = [];
    //initialization
    for (let i = 0; i < width * height; i++) sprite[i] = 0;
    const c = canvas.getContext("2d");
    const pixels = c.getImageData(0, 0, width, height).data;
    for (let i = 0; i < width * height; i++) {
      sprite[i] = pixels[i << 2];
    }
    board.sprite = sprite;
    return board;
  }

  function place(word, board, bc) {
    const maxDelta = ~~Math.sqrt(
        board.boxWidth * board.boxWidth + board.boxHeight * board.boxHeight
      ),
      startX = (bc + 1) * board.boxWidth,
      // startX =  ~~(board.boxX + (board.boxWidth*( Math.random() + .5) >> 1)),
      startY = ~~(
        board.boxY +
        ((board.boxHeight * (Math.random() + 0.5)) >> 1)
      ),
      s = spiral([board.boxWidth, board.boxHeight]),
      dt = Math.random() < 0.5 ? 1 : -1;
    let t = -dt,
      dxdy,
      dx,
      dy;
    word.x = startX;
    word.y = startY;
    word.placed = false;
    while ((dxdy = s((t += dt)))) {
      dx = ~~dxdy[0];
      dy = ~~dxdy[1];

      if (Math.max(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;

      word.x = startX + dx;
      word.y = startY + dy;

      if (
        word.x + word.x0 < 0 ||
        word.y + word.y0 < 0 ||
        word.x + word.x1 > screenDimensions[0] ||
        word.y + word.y1 > screenDimensions[1]
      )
        continue;
      if (!cloudCollide(word, board)) {
        placeWordToBoard(word, board);
        word.placed = true;
        break;
      }
    }
  }

  function cloudCollide(word, board) {
    const wh = word.height,
      ww = word.width,
      bw = board.width;
    //For each pixel in word
    for (let j = 0; j < wh; j++) {
      for (let i = 0; i < ww; i++) {
        const wsi = j * ww + i; //word sprite index;
        const wordPixel = word.sprite[wsi];

        const bsi = (j + word.y + word.y0) * bw + i + (word.x + word.x0); //board sprite index
        const boardPixel = board.sprite[bsi];

        if (boardPixel !== 0 && wordPixel !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  function placeWordToBoard(word, board) {
    //Add the sprite
    const y0 = word.y + word.y0,
      x0 = word.x + word.x0,
      bw = board.width,
      ww = word.width,
      wh = word.height;
    for (let j = 0; j < wh; j++) {
      for (let i = 0; i < ww; i++) {
        const wsi = j * ww + i;
        const bsi = (j + y0) * bw + i + x0;
        if (word.sprite[wsi] !== 0) board.sprite[bsi] = word.sprite[wsi];
      }
    }
  }

  function achemedeanSpiral(size) {
    const e = size[0] / size[1];
    return function (t) {
      return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
    };
  }
  return { data, stackedLayers, streamSizeScale, boxWidth, fields, dates };
}
