module.exports = {

  /* == COLORS == */
  c_primary_alpha: '#082e68',
  c_primary_beta: '#298bc8',
  c_primary_gamma: '#3dad99',

  c_secondary_alpha: '#ef6f1c',
  c_secondary_beta: '#f9d606',
  c_secondary_gamma: '#e91748',
  c_secondary_delta: '#fbcada',

  c_neutral_alpha: '#7a7f83',
  c_neutral_beta: '#f0f0f0',
  c_neutral_gamma: '#d3d8dd',
  c_neutral_delta: '#f7f7f9',

  /* == Z-INDEX == */
  z_popup: 1000,

  /* == FONT STACK == */
  f_stack: 'sans-serif',
  f_stack_icons: 'sans-serif',

  /* == TIMINGS == */
  t_animation: '200ms',

  /* == DIMENSIONS == */
  d_fs: '16px',
  d_lh: '24px',

  /* Grid */

  d_columns: 12,
  d_columns_gap: '1vr', /* vr = Vertical Rhythm, a unit based on d_lh */

  /* Devices */
  d_xs: '543px',
  d_sm: '544px',
  d_md: '768px',
  d_lg: '992px',
  d_xl: '1200px',
  d_sm_max: '767px', /* One less than counter part */
  d_md_max: '991px', /* One less than counter part */
  d_lg_max: '1199px', /* One less than counter part */

  /* BREAKPOINTS */
  b_xs: `(max-width: ${this.d_xs})`,
  b_sm: `(min-width: ${this.d_sm})`,
  b_md: `(min-width: ${this.d_md})`,
  b_lg: `(min-width: ${this.d_lg})`,
  b_xl: `(min-width: ${this.d_xl})`,
  b_sm_max: `(max-width: ${this.d_sm_max})`,
  b_md_max: `(max-width: ${this.d_md_max})`,
  b_lg_max: `(max-width: ${this.d_lg_max})`,

  /* ICONS */
  i_info: '"?"',
  i_warning: '"!"',
  i_close: '"x"',
  i_expand: '"+"',
  i_collapse: '"-"',
  i_list_item: '">"',
  i_checkbox: '"\2610"',
  i_checkbox_checked: '"\2611"',
  i_radio: '"\25EF"',
  i_radio_checked: '"\25C9"',
};
