// BRC-105 카드 코딩 실물 카드 43종 데이터베이스
export const CARD_CATEGORIES = [
  { id: 'all', name: '전체 카드', icon: '🎴', color: '#6366f1' },
  { id: 'start_end', name: '1. 시작 / 종료', icon: '🚩', color: '#ef4444' },
  { id: 'takeoff_landing', name: '2. 이착륙 / 대기', icon: '🛫', color: '#f59e0b' },
  { id: 'movement', name: '3. 평면 이동', icon: '↔️', color: '#3b82f6' },
  { id: 'altitude', name: '4. 고도 제어', icon: '↕️', color: '#10b981' },
  { id: 'rotation', name: '5. 회전 제어', icon: '🔄', color: '#8b5cf6' },
  { id: 'tricks', name: '6. 특수 동작(플립)', icon: '🤸', color: '#ec4899' },
  { id: 'loops', name: '7. 제어 & 반복', icon: '🔁', color: '#14b8a6' },
  { id: 'effects', name: '8. LED & 소리', icon: '💡', color: '#f43f5e' }
];

export const BRC_CARDS = [
  // 1. 시작 / 종료
  {
    id: 'start_coding',
    code: '#01',
    category: 'start_end',
    name: '코딩 시작',
    nameEn: 'START CODING',
    icon: '🚀',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)',
    sensorCode: ['#ef4444', '#ffffff', '#ef4444'],
    desc: '드론의 카드 인식 및 코딩 모드를 시작합니다.',
    action: { type: 'START' }
  },
  {
    id: 'end_coding',
    code: '#02',
    category: 'start_end',
    name: '코딩 끝',
    nameEn: 'END CODING',
    icon: '🏁',
    color: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
    sensorCode: ['#dc2626', '#000000', '#dc2626'],
    desc: '코딩 저장을 완료하고 비행 준비 상태가 됩니다.',
    action: { type: 'END' }
  },

  // 2. 이착륙 및 대기
  {
    id: 'takeoff',
    code: '#03',
    category: 'takeoff_landing',
    name: '이륙',
    nameEn: 'TAKEOFF',
    icon: '🛫',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
    sensorCode: ['#f59e0b', '#3b82f6', '#f59e0b'],
    desc: '모터를 가동하여 지정 높이(약 1m)로 시동 및 이륙합니다.',
    action: { type: 'TAKEOFF', altitude: 1.0 }
  },
  {
    id: 'landing',
    code: '#04',
    category: 'takeoff_landing',
    name: '착륙',
    nameEn: 'LANDING',
    icon: '🛬',
    color: '#d97706',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
    sensorCode: ['#d97706', '#10b981', '#d97706'],
    desc: '현재 위치에서 천천히 고도를 낮추어 안전하게 착륙합니다.',
    action: { type: 'LANDING', altitude: 0 }
  },
  {
    id: 'wait_1s',
    code: '#05',
    category: 'takeoff_landing',
    name: '대기 1초',
    nameEn: 'HOVER 1S',
    icon: '⏱️',
    color: '#b45309',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)',
    sensorCode: ['#b45309', '#ffffff', '#b45309'],
    desc: '1초 동안 제자리에서 정지 비행(호버링)합니다.',
    action: { type: 'WAIT', duration: 1.0 }
  },
  {
    id: 'wait_2s',
    code: '#06',
    category: 'takeoff_landing',
    name: '대기 2초',
    nameEn: 'HOVER 2S',
    icon: '⏳',
    color: '#b45309',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fcd34d 100%)',
    sensorCode: ['#b45309', '#000000', '#b45309'],
    desc: '2초 동안 제자리에서 정지 비행(호버링)합니다.',
    action: { type: 'WAIT', duration: 2.0 }
  },
  {
    id: 'wait_3s',
    code: '#07',
    category: 'takeoff_landing',
    name: '대기 3초',
    nameEn: 'HOVER 3S',
    icon: '🕰️',
    color: '#92400e',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fbbf24 100%)',
    sensorCode: ['#92400e', '#818cf8', '#92400e'],
    desc: '3초 동안 제자리에서 정지 비행(호버링)합니다.',
    action: { type: 'WAIT', duration: 3.0 }
  },

  // 3. 평면 이동
  {
    id: 'forward_1',
    code: '#08',
    category: 'movement',
    name: '전진 1칸',
    nameEn: 'FORWARD 1',
    icon: '⬆️',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
    sensorCode: ['#3b82f6', '#ffffff', '#3b82f6'],
    desc: '드론이 바라보는 방향으로 1칸 전진합니다.',
    action: { type: 'MOVE', direction: 'FORWARD', distance: 1 }
  },
  {
    id: 'forward_2',
    code: '#09',
    category: 'movement',
    name: '전진 2칸',
    nameEn: 'FORWARD 2',
    icon: '⬆️⬆️',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
    sensorCode: ['#3b82f6', '#ef4444', '#3b82f6'],
    desc: '드론이 바라보는 방향으로 2칸 전진합니다.',
    action: { type: 'MOVE', direction: 'FORWARD', distance: 2 }
  },
  {
    id: 'forward_3',
    code: '#10',
    category: 'movement',
    name: '전진 3칸',
    nameEn: 'FORWARD 3',
    icon: '🚀⬆️',
    color: '#2563eb',
    bgGradient: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
    sensorCode: ['#2563eb', '#f59e0b', '#2563eb'],
    desc: '드론이 바라보는 방향으로 3칸 연속 전진합니다.',
    action: { type: 'MOVE', direction: 'FORWARD', distance: 3 }
  },
  {
    id: 'backward_1',
    code: '#11',
    category: 'movement',
    name: '후진 1칸',
    nameEn: 'BACKWARD 1',
    icon: '⬇️',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
    sensorCode: ['#3b82f6', '#10b981', '#3b82f6'],
    desc: '드론의 뒤쪽 방향으로 1칸 후진합니다.',
    action: { type: 'MOVE', direction: 'BACKWARD', distance: 1 }
  },
  {
    id: 'backward_2',
    code: '#12',
    category: 'movement',
    name: '후진 2칸',
    nameEn: 'BACKWARD 2',
    icon: '⬇️⬇️',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
    sensorCode: ['#3b82f6', '#8b5cf6', '#3b82f6'],
    desc: '드론의 뒤쪽 방향으로 2칸 후진합니다.',
    action: { type: 'MOVE', direction: 'BACKWARD', distance: 2 }
  },
  {
    id: 'backward_3',
    code: '#13',
    category: 'movement',
    name: '후진 3칸',
    nameEn: 'BACKWARD 3',
    icon: '⬇️🚀',
    color: '#2563eb',
    bgGradient: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
    sensorCode: ['#2563eb', '#ec4899', '#2563eb'],
    desc: '드론의 뒤쪽 방향으로 3칸 연속 후진합니다.',
    action: { type: 'MOVE', direction: 'BACKWARD', distance: 3 }
  },
  {
    id: 'left_1',
    code: '#14',
    category: 'movement',
    name: '좌 이동 1칸',
    nameEn: 'LEFT 1',
    icon: '⬅️',
    color: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
    sensorCode: ['#1d4ed8', '#ffffff', '#1d4ed8'],
    desc: '회전하지 않고 왼쪽 방향으로 1칸 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'LEFT', distance: 1 }
  },
  {
    id: 'left_2',
    code: '#15',
    category: 'movement',
    name: '좌 이동 2칸',
    nameEn: 'LEFT 2',
    icon: '⬅️⬅️',
    color: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
    sensorCode: ['#1d4ed8', '#f59e0b', '#1d4ed8'],
    desc: '회전하지 않고 왼쪽 방향으로 2칸 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'LEFT', distance: 2 }
  },
  {
    id: 'left_3',
    code: '#16',
    category: 'movement',
    name: '좌 이동 3칸',
    nameEn: 'LEFT 3',
    icon: '⬅️🚀',
    color: '#1e40af',
    bgGradient: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
    sensorCode: ['#1e40af', '#10b981', '#1e40af'],
    desc: '회전하지 않고 왼쪽 방향으로 3칸 연속 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'LEFT', distance: 3 }
  },
  {
    id: 'right_1',
    code: '#17',
    category: 'movement',
    name: '우 이동 1칸',
    nameEn: 'RIGHT 1',
    icon: '➡️',
    color: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
    sensorCode: ['#1d4ed8', '#000000', '#1d4ed8'],
    desc: '회전하지 않고 오른쪽 방향으로 1칸 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'RIGHT', distance: 1 }
  },
  {
    id: 'right_2',
    code: '#18',
    category: 'movement',
    name: '우 이동 2칸',
    nameEn: 'RIGHT 2',
    icon: '➡️➡️',
    color: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 100%)',
    sensorCode: ['#1d4ed8', '#ec4899', '#1d4ed8'],
    desc: '회전하지 않고 오른쪽 방향으로 2칸 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'RIGHT', distance: 2 }
  },
  {
    id: 'right_3',
    code: '#19',
    category: 'movement',
    name: '우 이동 3칸',
    nameEn: 'RIGHT 3',
    icon: '➡️🚀',
    color: '#1e40af',
    bgGradient: 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)',
    sensorCode: ['#1e40af', '#8b5cf6', '#1e40af'],
    desc: '회전하지 않고 오른쪽 방향으로 3칸 연속 평행 이동합니다.',
    action: { type: 'MOVE', direction: 'RIGHT', distance: 3 }
  },

  // 4. 고도 제어
  {
    id: 'up_1',
    code: '#20',
    category: 'altitude',
    name: '상승 1칸',
    nameEn: 'ASCEND 1',
    icon: '🔝',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)',
    sensorCode: ['#10b981', '#ffffff', '#10b981'],
    desc: '고도를 위쪽으로 1칸(약 50cm) 올립니다.',
    action: { type: 'ALTITUDE', change: 1 }
  },
  {
    id: 'up_2',
    code: '#21',
    category: 'altitude',
    name: '상승 2칸',
    nameEn: 'ASCEND 2',
    icon: '🔝🔝',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)',
    sensorCode: ['#059669', '#3b82f6', '#059669'],
    desc: '고도를 위쪽으로 2칸(약 1m) 올립니다.',
    action: { type: 'ALTITUDE', change: 2 }
  },
  {
    id: 'down_1',
    code: '#22',
    category: 'altitude',
    name: '하강 1칸',
    nameEn: 'DESCEND 1',
    icon: '🔻',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)',
    sensorCode: ['#10b981', '#ef4444', '#10b981'],
    desc: '고도를 아래쪽으로 1칸 낮춥니다.',
    action: { type: 'ALTITUDE', change: -1 }
  },
  {
    id: 'down_2',
    code: '#23',
    category: 'altitude',
    name: '하강 2칸',
    nameEn: 'DESCEND 2',
    icon: '🔻🔻',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)',
    sensorCode: ['#059669', '#f59e0b', '#059669'],
    desc: '고도를 아래쪽으로 2칸 낮춥니다.',
    action: { type: 'ALTITUDE', change: -2 }
  },

  // 5. 회전 제어
  {
    id: 'turn_left_90',
    code: '#24',
    category: 'rotation',
    name: '좌회전 90°',
    nameEn: 'TURN LEFT 90°',
    icon: '↩️',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)',
    sensorCode: ['#8b5cf6', '#ffffff', '#8b5cf6'],
    desc: '제자리에서 왼쪽(반시계 방향)으로 90도 회전합니다.',
    action: { type: 'ROTATE', angle: -90 }
  },
  {
    id: 'turn_right_90',
    code: '#25',
    category: 'rotation',
    name: '우회전 90°',
    nameEn: 'TURN RIGHT 90°',
    icon: '↪️',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)',
    sensorCode: ['#8b5cf6', '#000000', '#8b5cf6'],
    desc: '제자리에서 오른쪽(시계 방향)으로 90도 회전합니다.',
    action: { type: 'ROTATE', angle: 90 }
  },
  {
    id: 'turn_180',
    code: '#26',
    category: 'rotation',
    name: '180° 회전',
    nameEn: 'TURN 180°',
    icon: '🔄',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
    sensorCode: ['#7c3aed', '#f59e0b', '#7c3aed'],
    desc: '정반대 방향으로 180도 회전합니다.',
    action: { type: 'ROTATE', angle: 180 }
  },
  {
    id: 'spin_360',
    code: '#27',
    category: 'rotation',
    name: '360° 제자리 회전',
    nameEn: 'SPIN 360°',
    icon: '🌀',
    color: '#6d28d9',
    bgGradient: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)',
    sensorCode: ['#6d28d9', '#10b981', '#6d28d9'],
    desc: '제자리에서 360도 연속 한 바퀴 회전합니다.',
    action: { type: 'ROTATE', angle: 360 }
  },

  // 6. 특수 동작 (플립)
  {
    id: 'flip_forward',
    code: '#28',
    category: 'tricks',
    name: '전진 플립',
    nameEn: 'FLIP FORWARD',
    icon: '🤸‍♂️⬆️',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    sensorCode: ['#ec4899', '#ffffff', '#ec4899'],
    desc: '공중에서 앞 방향으로 360도 공중회전 덤블링을 합니다.',
    action: { type: 'FLIP', direction: 'FORWARD' }
  },
  {
    id: 'flip_backward',
    code: '#29',
    category: 'tricks',
    name: '후진 플립',
    nameEn: 'FLIP BACKWARD',
    icon: '🤸‍♀️⬇️',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    sensorCode: ['#ec4899', '#3b82f6', '#ec4899'],
    desc: '공중에서 뒤 방향으로 360도 공중회전 덤블링을 합니다.',
    action: { type: 'FLIP', direction: 'BACKWARD' }
  },
  {
    id: 'flip_left',
    code: '#30',
    category: 'tricks',
    name: '좌 플립',
    nameEn: 'FLIP LEFT',
    icon: '🤸‍♂️⬅️',
    color: '#db2777',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)',
    sensorCode: ['#db2777', '#f59e0b', '#db2777'],
    desc: '공중에서 왼쪽으로 360도 공중회전 덤블링을 합니다.',
    action: { type: 'FLIP', direction: 'LEFT' }
  },
  {
    id: 'flip_right',
    code: '#31',
    category: 'tricks',
    name: '우 플립',
    nameEn: 'FLIP RIGHT',
    icon: '🤸‍♀️➡️',
    color: '#db2777',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #f472b6 100%)',
    sensorCode: ['#db2777', '#10b981', '#db2777'],
    desc: '공중에서 오른쪽으로 360도 공중회전 덤블링을 합니다.',
    action: { type: 'FLIP', direction: 'RIGHT' }
  },

  // 7. 제어 & 반복
  {
    id: 'loop_start_2',
    code: '#32',
    category: 'loops',
    name: '반복 시작 2회',
    nameEn: 'LOOP START 2X',
    icon: '🔁2️⃣',
    color: '#14b8a6',
    bgGradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    sensorCode: ['#14b8a6', '#ffffff', '#14b8a6'],
    desc: '다음 구간을 2회 반복 실행하도록 설정합니다.',
    action: { type: 'LOOP_START', count: 2 }
  },
  {
    id: 'loop_start_3',
    code: '#33',
    category: 'loops',
    name: '반복 시작 3회',
    nameEn: 'LOOP START 3X',
    icon: '🔁3️⃣',
    color: '#14b8a6',
    bgGradient: 'linear-gradient(135deg, #ccfbf1 0%, #5eead4 100%)',
    sensorCode: ['#14b8a6', '#ef4444', '#14b8a6'],
    desc: '다음 구간을 3회 반복 실행하도록 설정합니다.',
    action: { type: 'LOOP_START', count: 3 }
  },
  {
    id: 'loop_start_4',
    code: '#34',
    category: 'loops',
    name: '반복 시작 4회',
    nameEn: 'LOOP START 4X',
    icon: '🔁4️⃣',
    color: '#0d9488',
    bgGradient: 'linear-gradient(135deg, #99f6e4 0%, #2dd4bf 100%)',
    sensorCode: ['#0d9488', '#f59e0b', '#0d9488'],
    desc: '다음 구간을 4회 반복 실행하도록 설정합니다.',
    action: { type: 'LOOP_START', count: 4 }
  },
  {
    id: 'loop_end',
    code: '#35',
    category: 'loops',
    name: '반복 끝',
    nameEn: 'LOOP END',
    icon: '🔚',
    color: '#0f766e',
    bgGradient: 'linear-gradient(135deg, #99f6e4 0%, #14b8a6 100%)',
    sensorCode: ['#0f766e', '#000000', '#0f766e'],
    desc: '반복 구간의 끝을 지정합니다.',
    action: { type: 'LOOP_END' }
  },

  // 8. LED & 소리
  {
    id: 'led_red',
    code: '#36',
    category: 'effects',
    name: 'LED 빨간색',
    nameEn: 'LED RED',
    icon: '🔴',
    color: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    sensorCode: ['#ef4444', '#ef4444', '#ef4444'],
    desc: '드론의 LED를 빨간색으로 변경합니다.',
    action: { type: 'LED', color: '#ff2a2a' }
  },
  {
    id: 'led_green',
    code: '#37',
    category: 'effects',
    name: 'LED 초록색',
    nameEn: 'LED GREEN',
    icon: '🟢',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    sensorCode: ['#10b981', '#10b981', '#10b981'],
    desc: '드론의 LED를 초록색으로 변경합니다.',
    action: { type: 'LED', color: '#10b981' }
  },
  {
    id: 'led_blue',
    code: '#38',
    category: 'effects',
    name: 'LED 파란색',
    nameEn: 'LED BLUE',
    icon: '🔵',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    sensorCode: ['#3b82f6', '#3b82f6', '#3b82f6'],
    desc: '드론의 LED를 파란색으로 변경합니다.',
    action: { type: 'LED', color: '#3b82f6' }
  },
  {
    id: 'led_yellow',
    code: '#39',
    category: 'effects',
    name: 'LED 노란색',
    nameEn: 'LED YELLOW',
    icon: '🟡',
    color: '#eab308',
    bgGradient: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
    sensorCode: ['#eab308', '#eab308', '#eab308'],
    desc: '드론의 LED를 노란색으로 변경합니다.',
    action: { type: 'LED', color: '#facc15' }
  },
  {
    id: 'led_purple',
    code: '#40',
    category: 'effects',
    name: 'LED 보라색',
    nameEn: 'LED PURPLE',
    icon: '🟣',
    color: '#a855f7',
    bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    sensorCode: ['#a855f7', '#a855f7', '#a855f7'],
    desc: '드론의 LED를 보라색으로 변경합니다.',
    action: { type: 'LED', color: '#c084fc' }
  },
  {
    id: 'led_off',
    code: '#41',
    category: 'effects',
    name: 'LED 끄기',
    nameEn: 'LED OFF',
    icon: '⚪',
    color: '#64748b',
    bgGradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    sensorCode: ['#334155', '#334155', '#334155'],
    desc: '드론의 LED 조명을 끕니다.',
    action: { type: 'LED', color: 'off' }
  },
  {
    id: 'beep_1',
    code: '#42',
    category: 'effects',
    name: '부저 1회',
    nameEn: 'BEEP 1X',
    icon: '🔔',
    color: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fda4af 100%)',
    sensorCode: ['#f43f5e', '#ffffff', '#f43f5e'],
    desc: '드론에서 부저음을 1회 냅니다.',
    action: { type: 'BEEPER', count: 1 }
  },
  {
    id: 'beep_2',
    code: '#43',
    category: 'effects',
    name: '부저 2회',
    nameEn: 'BEEP 2X',
    icon: '🔔🔔',
    color: '#e11d48',
    bgGradient: 'linear-gradient(135deg, #ffe4e6 0%, #f43f5e 100%)',
    sensorCode: ['#e11d48', '#000000', '#e11d48'],
    desc: '드론에서 부저음을 2회 연속 냅니다.',
    action: { type: 'BEEPER', count: 2 }
  }
];

// 풍부한 예시 프로그래밍 세트 (기초~고급)
export const SAMPLE_PROGRAMS = [
  {
    id: 'basic_square',
    title: '📐 기초 사각 비행 코스',
    description: '이륙 후 4번 전진 및 우회전을 통해 정사각형 궤적 비행',
    cardIds: ['start_coding', 'takeoff', 'forward_2', 'turn_right_90', 'forward_2', 'turn_right_90', 'forward_2', 'turn_right_90', 'forward_2', 'turn_right_90', 'landing', 'end_coding']
  },
  {
    id: 'altitude_flip',
    title: '✨ 고도 상승 & 공중 플립',
    description: '고도를 2칸 올린 후 화려한 전진 플립과 부저 소리 내기',
    cardIds: ['start_coding', 'takeoff', 'up_2', 'led_blue', 'flip_forward', 'beep_2', 'down_2', 'landing', 'end_coding']
  },
  {
    id: 'loop_demo',
    title: '🔁 반복 문법 사각 비행',
    description: '반복 시작(4회) 블록을 활용하여 깔끔하게 사각 비행 완수하기',
    cardIds: ['start_coding', 'takeoff', 'led_green', 'loop_start_4', 'forward_2', 'turn_right_90', 'loop_end', 'landing', 'end_coding']
  },
  {
    id: 'zigzag_patrol',
    title: '⚡ 지그재그 순찰 비행',
    description: '전진과 좌우 평행 이동을 조합하여 지그재그 경로 탐색',
    cardIds: ['start_coding', 'takeoff', 'forward_1', 'right_2', 'forward_1', 'left_2', 'forward_1', 'right_2', 'landing', 'end_coding']
  },
  {
    id: 'rainbow_light_show',
    title: '🌈 무지개 LED 조명 비행',
    description: '공중에서 다양한 LED 조명 색상을 바꾸며 제자리 회전',
    cardIds: ['start_coding', 'takeoff', 'led_red', 'wait_1s', 'led_yellow', 'spin_360', 'led_purple', 'wait_1s', 'landing', 'end_coding']
  },
  {
    id: 'advanced_acrobat',
    title: '🏆 고급 아크로바틱 콤보',
    description: '고도 상승, 좌우 플립, 360도 회전을 연속으로 수행하는 화려한 비행',
    cardIds: ['start_coding', 'takeoff', 'up_1', 'flip_left', 'flip_right', 'spin_360', 'beep_2', 'down_1', 'landing', 'end_coding']
  }
];

// 학생용 흥미진진 미션 도전 과제 (Mission Challenges)
export const MISSIONS = [
  {
    id: 'mission_1',
    title: '🎯 미션 1: 목적지 타겟 착륙',
    difficulty: '⭐ 초급',
    goalText: '이륙 후 앞으로 2칸, 오른쪽으로 2칸 이동한 좌표(X:2, Y:2) 지점에 정확히 착륙하세요!',
    hint: '[코딩 시작] ➔ [이륙] ➔ [전진 2칸] ➔ [우 이동 2칸] ➔ [착륙] ➔ [코딩 끝]',
    targetX: 2,
    targetY: 2,
    validate: (state, queue) => {
      const landed = state.isLanded;
      const dist = Math.hypot(state.x - 2, state.y - 2);
      return landed && dist < 0.5;
    }
  },
  {
    id: 'mission_2',
    title: '🤸 미션 2: 공중 플립 마스터',
    difficulty: '⭐⭐ 중급',
    goalText: '고도를 2칸 상승시킨 후, 공중 플립(Flip) 동작을 1회 이상 수행하고 착륙하세요!',
    hint: '[코딩 시작] ➔ [이륙] ➔ [상승 2칸] ➔ [전진 플립] ➔ [하강 2칸] ➔ [착륙] ➔ [코딩 끝]',
    validate: (state, queue) => {
      const hasFlip = queue.some(item => item.card.action.type === 'FLIP');
      return state.isLanded && hasFlip;
    }
  },
  {
    id: 'mission_3',
    title: '🌈 미션 3: 무지개 LED 라이트쇼',
    difficulty: '⭐⭐ 중급',
    goalText: '비행 도중 LED 색상을 최소 2가지 이상 바꾸고 소리(부저)를 울린 뒤 착륙하세요!',
    hint: '[코딩 시작] ➔ [이륙] ➔ [LED 빨간색] ➔ [LED 파란색] ➔ [부저 1회] ➔ [착륙] ➔ [코딩 끝]',
    validate: (state, queue) => {
      const ledCards = queue.filter(item => item.card.action.type === 'LED' && item.card.action.color !== 'off');
      const hasBeep = queue.some(item => item.card.action.type === 'BEEPER');
      return state.isLanded && ledCards.length >= 2 && hasBeep;
    }
  },
  {
    id: 'mission_4',
    title: '🔁 미션 4: 반복 블록 효율왕',
    difficulty: '⭐⭐⭐ 상급',
    goalText: '반복 시작(Loop) 카드를 사용하여 사각 비행 코스를 완성하고 착륙하세요!',
    hint: '[코딩 시작] ➔ [이륙] ➔ [반복 시작 4회] ➔ [전진 2칸] ➔ [우회전 90°] ➔ [반복 끝] ➔ [착륙] ➔ [코딩 끝]',
    validate: (state, queue) => {
      const hasLoop = queue.some(item => item.card.action.type === 'LOOP_START');
      return state.isLanded && hasLoop;
    }
  },
  {
    id: 'mission_5',
    title: '🌀 미션 5: 360도 스핀 & 고도 탐색',
    difficulty: '⭐⭐⭐ 상급',
    goalText: '상승 1칸 후 360도 제자리 회전과 좌우 평행 이동을 조합하여 비행 후 착륙하세요!',
    hint: '[코딩 시작] ➔ [이륙] ➔ [상승 1칸] ➔ [360° 제자리 회전] ➔ [좌 이동 2칸] ➔ [착륙] ➔ [코딩 끝]',
    validate: (state, queue) => {
      const hasSpin = queue.some(item => item.card.action.type === 'ROTATE' && item.card.action.angle === 360);
      return state.isLanded && hasSpin;
    }
  },
  {
    id: 'mission_6',
    title: '🏆 미션 6: BRC-105 마스터 최종 시험',
    difficulty: '👑 최상급 마스터',
    goalText: '고도 상승 + 공중 플립 + LED 조명 + 타겟 좌표(X:-2, Y:2) 착륙을 모두 성공시키세요!',
    hint: '[이륙] ➔ [상승 1칸] ➔ [전진 플립] ➔ [LED 초록색] ➔ [좌 이동 2칸] ➔ [전진 2칸] ➔ [착륙]',
    targetX: -2,
    targetY: 2,
    validate: (state, queue) => {
      const landed = state.isLanded;
      const dist = Math.hypot(state.x - (-2), state.y - 2);
      const hasFlip = queue.some(item => item.card.action.type === 'FLIP');
      const hasLed = queue.some(item => item.card.action.type === 'LED' && item.card.action.color !== 'off');
      return landed && dist < 0.8 && hasFlip && hasLed;
    }
  }
];

