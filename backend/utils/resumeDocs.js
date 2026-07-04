const PDFDocument = require('pdfkit');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle
} = require('docx');

function buildResumePDF(resume, res) {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf"`);
  doc.pipe(res);

  doc.fontSize(22).fillColor('#1e1b4b').text(resume.fullName, { align: 'center' });
  doc.moveDown(0.2);
  doc.fontSize(10).fillColor('#444').text(
    [resume.email, resume.phone, resume.targetRole].filter(Boolean).join(' | '),
    { align: 'center' }
  );
  doc.moveDown();
  doc.strokeColor('#6366f1').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown();

  function section(title) {
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#4338ca').text(title.toUpperCase());
    doc.strokeColor('#c7d2fe').lineWidth(0.5).moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).stroke();
    doc.moveDown(0.3);
    doc.fontSize(10.5).fillColor('#111');
  }

  if (resume.summary) {
    section('Professional Summary');
    doc.text(resume.summary);
  }

  if (resume.skills?.length) {
    section('Skills');
    doc.text(resume.skills.join('  •  '));
  }

  if (resume.experience?.length) {
    section('Experience');
    resume.experience.forEach(exp => {
      doc.font('Helvetica-Bold').text(`${exp.role} — ${exp.company}`, { continued: false });
      doc.font('Helvetica').fontSize(9).fillColor('#555').text(exp.duration || '');
      doc.fontSize(10.5).fillColor('#111').text(exp.description || '');
      doc.moveDown(0.4);
    });
  }

  if (resume.projects?.length) {
    section('Projects');
    resume.projects.forEach(p => {
      doc.font('Helvetica-Bold').text(p.title);
      doc.font('Helvetica').text(p.description || '');
      doc.moveDown(0.3);
    });
  }

  if (resume.education?.length) {
    section('Education');
    resume.education.forEach(ed => {
      doc.text(`${ed.degree}, ${ed.institution} (${ed.year || ''})`);
    });
  }

  if (resume.certifications?.length) {
    section('Certifications');
    doc.text(resume.certifications.join(', '));
  }

  doc.end();
}

async function buildResumeDocx(resume, res) {
  const children = [
    new Paragraph({
      text: resume.fullName,
      heading: HeadingLevel.TITLE,
      alignment: 'center'
    }),
    new Paragraph({
      alignment: 'center',
      children: [
        new TextRun({
          text: [resume.email, resume.phone, resume.targetRole].filter(Boolean).join(' | '),
          italics: true,
          size: 20
        })
      ]
    }),
    new Paragraph({ text: '' })
  ];

  function heading(text) {
    children.push(
      new Paragraph({
        text,
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: '6366f1', space: 1, style: BorderStyle.SINGLE, size: 6 } }
      })
    );
  }

  if (resume.summary) {
    heading('Professional Summary');
    children.push(new Paragraph(resume.summary));
  }

  if (resume.skills?.length) {
    heading('Skills');
    children.push(new Paragraph(resume.skills.join('  •  ')));
  }

  if (resume.experience?.length) {
    heading('Experience');
    resume.experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${exp.role} — ${exp.company}`, bold: true })]
        })
      );
      if (exp.duration) children.push(new Paragraph({ children: [new TextRun({ text: exp.duration, italics: true, size: 18 })] }));
      if (exp.description) children.push(new Paragraph(exp.description));
    });
  }

  if (resume.projects?.length) {
    heading('Projects');
    resume.projects.forEach(p => {
      children.push(new Paragraph({ children: [new TextRun({ text: p.title, bold: true })] }));
      if (p.description) children.push(new Paragraph(p.description));
    });
  }

  if (resume.education?.length) {
    heading('Education');
    resume.education.forEach(ed => {
      children.push(new Paragraph(`${ed.degree}, ${ed.institution} (${ed.year || ''})`));
    });
  }

  if (resume.certifications?.length) {
    heading('Certifications');
    children.push(new Paragraph(resume.certifications.join(', ')));
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${resume.fullName.replace(/\s+/g, '_')}_Resume.docx"`);
  res.send(buffer);
}

module.exports = { buildResumePDF, buildResumeDocx };
